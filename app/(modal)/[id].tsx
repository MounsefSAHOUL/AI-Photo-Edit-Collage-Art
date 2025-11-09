import {Colors} from '@/constants/theme';
import {MODELS} from '@/i18n/models';
import {ModelId} from '@/types/models';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useMemo} from 'react';
import {Image, Pressable, Text, TextInput, View} from 'react-native';

export default function ModelScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();

  const model = useMemo(() => {
    const key = (id || '').trim() as ModelId;
    return MODELS[key];
  }, [id]);

  const theme = Colors.default;
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [variant, setVariant] = React.useState(model.variants?.[0] ?? '');
  //const [output, setOutput] = React.useState(model.outputs?.[0] ?? '');

  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) setPhoto(res.assets[0].uri);
  };

  const generate = async () => {};

  // Si modèle inconnu → petit fallback
  if (!model) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A0A0A',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
        <Text style={{color: '#fff', fontSize: 18, marginBottom: 8}}>
          Modèle introuvable
        </Text>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={{color: '#4AF0FF'}}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.gradient[0], theme.gradient[1]]}
      style={{flex: 1}}>
      <View style={{padding: 16, gap: 12}}>
        <Text style={{color: theme.text, fontSize: 22}}>{model.name.fr}</Text>
        <Text style={{color: theme.text, opacity: 0.8}}>
          {model.description.fr}
        </Text>

        {/* Upload photo */}
        <Pressable
          onPress={pickImage}
          style={{
            marginTop: 8,
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.accent,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <Text style={{color: theme.text}}>
            {photo ? 'Changer la photo' : 'Choisir une photo'}
          </Text>
        </Pressable>

        {photo && (
          <Image
            source={{uri: photo}}
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.accent,
            }}
            resizeMode="cover"
          />
        )}

        {/* Variant (simple input ou remplace par un picker selon ta stack UI) */}
        {model.variants?.length ? (
          <View style={{gap: 6, marginTop: 8}}>
            <Text style={{color: theme.text, opacity: 0.9}}>Variant</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
              {model.variants.map((v: any) => (
                <Pressable
                  key={v}
                  onPress={() => setVariant(v)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: theme.accent,
                    backgroundColor:
                      v === variant ? theme.accent : 'transparent',
                  }}>
                  <Text
                    style={{
                      color: v === variant ? '#0A0A0A' : theme.text,
                    }}>
                    {v}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* Output */}
        {model.variants.length ? (
          <View style={{gap: 6, marginTop: 4}}>
            <Text style={{color: theme.text, opacity: 0.9}}>Format</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
              {model.variants.map((o: any) => (
                <Pressable key={o}></Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* Notes / prompt additionnel (optionnel) */}
        <View style={{gap: 6, marginTop: 8}}>
          <Text style={{color: theme.text, opacity: 0.9}}>
            Notes (facultatif)
          </Text>
          <TextInput
            placeholder="Ex: style néon, accessoires gamer, fond cyberpunk..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{
              color: theme.text,
              borderWidth: 1,
              borderColor: theme.accent,
              borderRadius: 12,
              padding: 12,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}
          />
        </View>

        {/* Générer */}
        <Pressable
          onPress={generate}
          style={{
            marginTop: 14,
            padding: 16,
            borderRadius: 16,
            backgroundColor: theme.accent,
            alignItems: 'center',
          }}>
          <Text style={{color: '#0A0A0A'}}>Générer</Text>
        </Pressable>

        {/* Accès Preview/Gallery si besoin */}
        <Pressable
          onPress={() => router.push('/(tabs)/explore')}
          style={{marginTop: 6, alignItems: 'center'}}>
          <Text
            style={{
              color: theme.text,
              textDecorationLine: 'underline',
              opacity: 0.8,
            }}>
            Voir la galerie
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
