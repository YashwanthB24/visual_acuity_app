// my-app/components/TranscribeOutput.tsx

import React from 'react';
import { View, Text } from 'react-native';

// Define the props interface
interface TranscribeOutputProps {
  output: string; // Specify that output should be a string
}

const TranscribeOutput: React.FC<TranscribeOutputProps> = ({ output }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16 }}>Transcribed Text:</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{output}</Text>
    </View>
  );
};

export default TranscribeOutput;
