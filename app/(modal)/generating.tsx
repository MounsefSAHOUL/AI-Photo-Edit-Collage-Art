import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

export default function GeneratingModal() {
  const {id, variant, output} = useLocalSearchParams<{
    id: string;
    variant?: string;
    output?: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    // Simule un temps de génération puis va vers preview
    const t = setTimeout(() => {
      router.replace({
        pathname: '/(modal)/preview',
        params: {uri: 'https://placehold.co/1024x1024.png'},
      });
    }, 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000A',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
      <ActivityIndicator size="large" color="#4AF0FF" />
      <Text style={{color: '#fff'}}>Génération en cours…</Text>
      <Text style={{color: '#fff', opacity: 0.7}}>
        {id} • {variant} • {output}
      </Text>
    </View>
  );
}
