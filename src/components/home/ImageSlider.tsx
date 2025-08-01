import React from 'react';
import { View, ScrollView, Image, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth * 0.8;
const SIDE_SPACE = (screenWidth - IMAGE_WIDTH) / 2;

interface ImageSliderProps {
  images: { uri: string }[];
  sliderIndex: number;
  setSliderIndex: (idx: number) => void;
  sliderRef: React.RefObject<ScrollView>;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, sliderIndex, setSliderIndex, sliderRef }) => {
  const onSliderScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setSliderIndex(idx);
  };
  return (
    <View className="w-full h-40 mt-4 mb-2">
      <ScrollView
        ref={sliderRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={IMAGE_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onSliderScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: SIDE_SPACE }}
        className="w-full h-full"
      >
        {images.map((img, idx) => (
          <View
            key={idx}
            className="h-40 rounded-3xl mx-2 shadow-2xl overflow-hidden"
            style={{ width: IMAGE_WIDTH }}
          >
            <Image
              source={img}
              className="w-full h-full"
              style={{ resizeMode: 'cover', borderRadius: 24 }}
            />
          </View>
        ))}
      </ScrollView>
      {/* Indicator Dots */}
      <View className="flex-row justify-center items-center mt-2 absolute bottom-2 left-0 right-0">
        {images.map((_, idx) => (
          <View
            key={idx}
            className={`mx-1 w-2 h-2 rounded-full ${sliderIndex === idx ? 'bg-indigo-500' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider; 