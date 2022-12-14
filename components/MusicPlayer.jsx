import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Slider from '@react-native-community/slider'
import songs from '../model/data'
import TrackPlayer, {
  usePlaybackState,
  State,
  useProgress,
  useTrackPlayerEvents,
  RepeatMode,
  Event,
  Capability,
} from 'react-native-track-player'

const { width, height } = Dimensions.get('window')

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer()

  await TrackPlayer.add(songs)
}

const togglePlayback = async (playbackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack()

  if (currentTrack !== null) {
    if (playbackState == State.Paused) {
      await TrackPlayer.play()
    } else {
      await TrackPlayer.pause()
    }
  }
}

export default function MusicPlayer() {
  const playbackState = usePlaybackState()
  const progress = useProgress()
  const scrollX = useRef(new Animated.Value(0)).current
  const [songIndex, setSongIndex] = useState(0)
  const [repeatMode, setRepeatMode] = useState('off')

  const [trackImage, setTrackImage] = useState()
  const [trackArtist, setTrackArtist] = useState()
  const [trackTitle, setTrackTitle] = useState()

  const songSlider = useRef(null)

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack)
      const { title, image, artist } = track
      setTrackImage(image)
      setTrackArtist(artist)
      setTrackTitle(title)
    }
  })

  useEffect(() => {
    setupPlayer()
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width)
      skipTo(index)
      setSongIndex(index)
    })
    return () => {
      scrollX.removeAllListeners()
    }
  }, [])

  // Chuy???n ?????n b??i tr?????c

  const skipToPrev = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    })
  }

  // Chuy???n ?????n b??i sau

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    })
  }

  const skipTo = async (trackId) => {
    await TrackPlayer.skip(trackId)
  }

  // Icon ch??? ????? ph??t l???i
  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off'
    }
    if (repeatMode === 'track') {
      return 'repeat-once'
    }
    if (repeatMode === 'repeat') {
      return 'repeat'
    }
  }

  // Ch??? ????? ph??t l???i
  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track)
      setRepeatMode('track')
    }
    if (repeatMode === 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue)
      setRepeatMode('repeat')
    }
    if (repeatMode === 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off)
      setRepeatMode('off')
    }
  }

  // Render b??i h??t
  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={styles.trackImageWrapper}>
          <Image source={item.image} style={styles.trackImage} />
        </View>
      </Animated.View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={songs}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x: scrollX },
                },
              },
            ],
            { useNativeDriver: true },
          )}
        />
        {/* T??n b??i h??t, t??n ca s?? */}
        <View>
          <Text style={styles.title}>{trackTitle}</Text>
          <Text style={styles.artist}>{trackArtist}</Text>
        </View>

        <View>
          {/* Thanh th???i gian */}
          <Slider
            style={styles.progressContainer}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#8475F3"
            minimumTrackTintColor="#8475F3"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={async (value) => {
              await TrackPlayer.seekTo(value)
            }}
          />

          {/* Th???i gian b???t ?????u v?? k???t th??c */}
          <View style={styles.ProgressTimeContainer}>
            <Text style={styles.ProgressTime}>
              {new Date(progress.position * 1000)
                .toISOString()
                .substring(14, 5)}
            </Text>
            <Text style={styles.ProgressTime}>
              {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substring(14, 5)}
            </Text>
          </View>

          {/* B???ng ??i???u khi???n */}
          <View style={styles.playerControl}>
            <TouchableOpacity onPress={skipToPrev}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                color="#8475F3"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => togglePlayback(playbackState)}>
              <Ionicons
                name={
                  playbackState === State.playing
                    ? 'ios-pause-circle'
                    : 'ios-play-circle'
                }
                size={75}
                color="#8475F3"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <Ionicons
                name="play-skip-forward-outline"
                size={35}
                color="#8475F3"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomControl}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={30}
              color={repeatMode !== 'off' ? '#8475F3' : '#777777'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#777777" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  trackImageWrapper: {
    marginBottom: 25,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    elevation: 5,
  },
  trackImage: {
    width: 300,
    height: 340,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  ProgressTimeContainer: {
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ProgressTime: {
    color: '#FFF',
  },
  playerControl: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 15,
    marginLeft: 60,
  },
})
