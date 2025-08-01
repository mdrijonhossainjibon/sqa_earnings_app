import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, autoFocus }) => {
  const inputs = Array(6).fill(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, idx: number) => {
    let newValue = value.split('');
    if (text.length > 1) {
      // Handle paste
      const chars = text.split('').slice(0, 6);
      onChange(chars.join(''));
      if (chars.length < 6 && inputRefs.current[chars.length]) {
        inputRefs.current[chars.length]?.focus();
      }
      return;
    }
    if (text === '') {
      newValue[idx] = '';
      onChange(newValue.join(''));
      if (idx > 0) inputRefs.current[idx - 1]?.focus();
      return;
    }
    newValue[idx] = text;
    onChange(newValue.join(''));
    if (idx < 5 && text) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center space-x-2">
      {inputs.map((_, idx) => (
        <TextInput
          key={idx}
          ref={ref => { inputRefs.current[idx] = ref; }}
          className="w-12 h-14 ml-2 text-center text-2xl font-bold bg-[#222531] text-white rounded-lg border border-[#222531] focus:border-[#FCD535]"
          keyboardType="number-pad"
          maxLength={1}
          value={value[idx] || ''}
          onChangeText={text => handleChange(text, idx)}
          onKeyPress={e => handleKeyPress(e, idx)}
          autoFocus={autoFocus && idx === 0}
          selectionColor="#FCD535"
        />
      ))}
    </View>
  );
};

export default OTPInput; 