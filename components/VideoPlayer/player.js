import React, { Component } from "react";
import ReactWebMediaPlayer from "react-web-media-player";

class Player extends Component {
  constructor() {
    super(props);
  }

  render() {
    console.log(props);
    return (
      <ReactWebMediaPlayer
        title="My own video player"
        video="https://any-link.com/my-video.mp4"
        thumbnail="https://any-link.com/video-thumbnail.jpg"
      />
    );
  }
}

export default Player;
