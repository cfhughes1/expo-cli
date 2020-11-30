import { Builder, Parser } from 'xml2js';

type IBBoolean = 'YES' | 'NO' | boolean;

type IBItem<
  H extends Record<string, any>,
  B extends Record<string, any[]> = { [key: string]: any }
> = {
  $: H;
} & B;

type Rect = {
  key: string;
  x: string;
  y: string;
  width: number;
  height: number;
};

export type ImageContentMode = 'scaleAspectFit' | 'scaleAspectFill';
type ConstraintAttribute = 'top' | 'bottom' | 'trailing' | 'leading';

type IBImageView = IBItem<
  {
    id: string;
    userLabel: string;
    image: string;
    clipsSubviews?: IBBoolean;
    userInteractionEnabled: IBBoolean;
    contentMode: string | 'scaleAspectFill';
    horizontalHuggingPriority: number;
    verticalHuggingPriority: number;
    insetsLayoutMarginsFromSafeArea?: IBBoolean;
    translatesAutoresizingMaskIntoConstraints?: IBBoolean;
  },
  {
    rect: IBItem<Rect>[];
  }
>;

type IBConstraint = IBItem<{
  firstItem: string;
  firstAttribute: ConstraintAttribute;
  secondItem: string;
  secondAttribute: ConstraintAttribute;
  id: string;
}>;

export type IBSplashScreenDocument = {
  document: IBItem<
    {
      type: 'com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB' | string;
      version: '3.0' | string;
      toolsVersion: number;
      targetRuntime: 'iOS.CocoaTouch' | string;
      propertyAccessControl: 'none' | string;
      useAutolayout: IBBoolean;
      launchScreen: IBBoolean;
      useTraitCollections: IBBoolean;
      useSafeAreas: IBBoolean;
      colorMatched: IBBoolean;
      initialViewController: string;
    },
    {
      device: IBItem<{
        id: string;
        orientation: string | 'portrait';
        appearance: string | 'light';
      }>[];
      dependencies: unknown[];
      scenes: {
        scene: IBItem<
          { sceneID: string },
          {
            objects: {
              viewController: IBItem<
                {
                  id: string;
                  placeholderIdentifier?: string;
                  userLabel: string;
                  sceneMemberID: string;
                },
                {
                  view: IBItem<
                    {
                      key: string;
                      userInteractionEnabled: IBBoolean;
                      contentMode: string | 'scaleToFill';
                      insetsLayoutMarginsFromSafeArea: IBBoolean;
                      id: string;
                      userLabel: string;
                    },
                    {
                      rect: IBItem<Rect>[];
                      autoresizingMask: IBItem<{
                        key: string;
                        flexibleMaxX: IBBoolean;
                        flexibleMaxY: IBBoolean;
                      }>[];

                      subviews: IBItem<
                        object,
                        {
                          imageView: IBImageView[];
                        }
                      >[];
                      color: IBItem<{
                        key: string | 'backgroundColor';
                        systemColor: string | 'systemBackgroundColor';
                      }>[];
                      constraints: IBItem<
                        object,
                        {
                          constraint: IBConstraint[];
                        }
                      >[];
                      viewLayoutGuide: IBItem<{
                        key: string | 'safeArea';
                        id: string;
                      }>[];
                    }
                  >[];
                }
              >[];
              placeholder: IBItem<{
                id: string;
                placeholderIdentifier?: string;
                userLabel: string;
                sceneMemberID: string;
              }>[];
            }[];
            point: IBItem<{
              key: string | 'canvasLocation';
              x: number;
              y: number;
            }>[];
          }
        >[];
      }[];
      resources: {
        image: IBItem<{
          name: string;
          width: number;
          height: number;
        }>[];
      }[];
    }
  >;
};

export function applyImageToSplashScreenXML(
  xml: IBSplashScreenDocument,
  {
    imageName,
    contentMode,
  }: {
    imageName: string;
    contentMode: ImageContentMode;
  }
): IBSplashScreenDocument {
  const imageId = 'EXPO-SplashScreen';
  const containerId = 'EXPO-ContainerView';
  const width = 414;
  const height = 736;

  const imageView: IBImageView = {
    $: {
      id: imageId,
      userLabel: imageName,
      image: imageName,
      contentMode,
      horizontalHuggingPriority: 251,
      verticalHuggingPriority: 251,
      clipsSubviews: true,
      userInteractionEnabled: false,
      translatesAutoresizingMaskIntoConstraints: false,
    },
    rect: [
      {
        $: {
          key: 'frame',
          x: '0.0',
          y: '0.0',
          width,
          height,
        },
      },
    ],
  };

  // Add ImageView
  xml.document.scenes[0].scene[0].objects[0].viewController[0].view[0].subviews[0].imageView.push(
    imageView
  );

  // Add Constraints
  xml.document.scenes[0].scene[0].objects[0].viewController[0].view[0].constraints[0].constraint.push(
    // <constraint firstItem="EXPO-SplashScreen" firstAttribute="top" secondItem="EXPO-ContainerView" secondAttribute="top" id="2VS-Uz-0LU"/>
    {
      $: {
        firstItem: imageId,
        firstAttribute: 'top',
        secondItem: containerId,
        secondAttribute: 'top',
        id: '2VS-Uz-0LU',
      },
    },
    {
      $: {
        firstItem: imageId,
        firstAttribute: 'leading',
        secondItem: containerId,
        secondAttribute: 'leading',
        id: 'LhH-Ei-DKo',
      },
    },
    {
      $: {
        firstItem: imageId,
        firstAttribute: 'trailing',
        secondItem: containerId,
        secondAttribute: 'trailing',
        id: 'I6l-TP-6fn',
      },
    },
    {
      $: {
        firstItem: imageId,
        firstAttribute: 'bottom',
        secondItem: containerId,
        secondAttribute: 'bottom',
        id: 'nbp-HC-eaG',
      },
    }
  );

  // Add resource
  xml.document.resources[0].image.push({
    // <image name="SplashScreen" width="414" height="736"/>
    $: {
      name: imageName,
      width,
      height,
    },
  });

  return xml;
}

export async function createTemplateSplashScreenAsync(): Promise<IBSplashScreenDocument> {
  const contents = `<?xml version="1.0" encoding="UTF-8"?>
    <document
      type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB"
      version="3.0"
      toolsVersion="16096"
      targetRuntime="iOS.CocoaTouch"
      propertyAccessControl="none"
      useAutolayout="YES"
      launchScreen="YES"
      useTraitCollections="YES"
      useSafeAreas="YES"
      colorMatched="YES"
      initialViewController="EXPO-VIEWCONTROLLER-1"
    >
      <device id="retina5_5" orientation="portrait" appearance="light"/>
      <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="16087"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
      </dependencies>
      <scenes>
        <!--View Controller-->
        <scene sceneID="EXPO-SCENE-1">
          <objects>
            <viewController
              storyboardIdentifier="SplashScreenViewController"
              id="EXPO-VIEWCONTROLLER-1"
              sceneMemberID="viewController"
            >
              <view
                key="view"
                userInteractionEnabled="NO"
                contentMode="scaleToFill"
                insetsLayoutMarginsFromSafeArea="NO"
                id="EXPO-ContainerView"
                userLabel="ContainerView"
              >
                <rect key="frame" x="0.0" y="0.0" width="414" height="736"/>
                <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
                <subviews>
                  <imageView
                    userInteractionEnabled="NO"
                    contentMode="scaleAspectFill"
                    horizontalHuggingPriority="251"
                    verticalHuggingPriority="251"
                    insetsLayoutMarginsFromSafeArea="NO"
                    image="SplashScreenBackground"
                    translatesAutoresizingMaskIntoConstraints="NO"
                    id="EXPO-SplashScreenBackground"
                    userLabel="SplashScreenBackground"
                  >
                    <rect key="frame" x="0.0" y="0.0" width="414" height="736"/>
                  </imageView>
                </subviews>
                <color key="backgroundColor" systemColor="systemBackgroundColor"/>
                <constraints>
                  <constraint firstItem="EXPO-SplashScreenBackground" firstAttribute="top" secondItem="EXPO-ContainerView" secondAttribute="top" id="1gX-mQ-vu6"/>
                  <constraint firstItem="EXPO-SplashScreenBackground" firstAttribute="leading" secondItem="EXPO-ContainerView" secondAttribute="leading" id="6tX-OG-Sck"/>
                  <constraint firstItem="EXPO-SplashScreenBackground" firstAttribute="trailing" secondItem="EXPO-ContainerView" secondAttribute="trailing" id="ABX-8g-7v4"/>
                  <constraint firstItem="EXPO-SplashScreenBackground" firstAttribute="bottom" secondItem="EXPO-ContainerView" secondAttribute="bottom" id="jkI-2V-eW5"/>
                </constraints>
                <viewLayoutGuide key="safeArea" id="Rmq-lb-GrQ"/>
              </view>
            </viewController>
            <placeholder placeholderIdentifier="IBFirstResponder" id="EXPO-PLACEHOLDER-1" userLabel="First Responder" sceneMemberID="firstResponder"/>
          </objects>
          <point key="canvasLocation" x="140.625" y="129.4921875"/>
        </scene>
      </scenes>
      <resources>
        <image name="SplashScreenBackground" width="1" height="1"/>
      </resources>
    </document>`;
  return await new Parser().parseStringPromise(contents);
}

// Attempt to copy Xcode formatting.
export function toString(xml: any): string {
  const builder = new Builder({
    preserveChildrenOrder: true,
    xmldec: {
      version: '1.0',
      encoding: 'UTF-8',
    },
    renderOpts: {
      pretty: true,
      indent: '    ',
    },
  });
  return builder.buildObject(xml);
}
