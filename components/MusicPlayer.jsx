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
import Slider from '@react-native-community/slider'
import songs from '../model/data'

const { width, height } = Dimensions.get('window')

export default function MusicPlayer() {
  const scrollX = useRef(new Animated.Value(0)).current
  const [songIndex, setSongIndex] = useState(0)

  const songSlider = useRef(null)

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width)
      setSongIndex(index)
    })
    return () => {
      scrollX.removeAllListeners()
    }
  }, [])

  // Render bài hát
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
        {/* Tên bài hát, tên ca sĩ */}
        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>

        <View>
          {/* Thanh thời gian */}
          <Slider
            style={styles.progressContainer}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#8475F3"
            minimumTrackTintColor="#8475F3"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={() => {}}
          />

          {/* Thời gian bắt đầu và kết thúc */}
          <View style={styles.ProgressTimeContainer}>
            <Text style={styles.ProgressTime}>0:00</Text>
            <Text style={styles.ProgressTime}>3:55</Text>
          </View>

          {/* Bảng điều khiển */}
          <View style={styles.playerControl}>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                color="#8475F3"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="ios-pause-circle" size={75} color="#8475F3" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
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
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#777777" />
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
