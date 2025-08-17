import {useState} from "react";
import ZoomVideo from "@zoom/videosdk";

const useZoomVideoTest = (meeting, dataId, setMeetingStarted, handleMeetingStart, config) => {
    const [client] = useState(() => ZoomVideo.createClient());
    const [mediaStream, setMediaStream] = useState(null);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    const getVideoSDKJWT = async (e) => {
        try {
            e.preventDefault?.(); // in case e is Event
            handleMeetingStart();
            // Use config as provided, do not override any values
            await joinSession();
        } catch (err) {
            console.error('Error in getVideoSDKJWT:', err);
        }
    };

    const joinSession = async () => {
        try {
            const videoElement = document.getElementById("zoom-video");
            if (!videoElement) {
                // Toast removed: handle error as needed
                console.error('Video element not found.');
                return;
            }

            await client.init("en-US", "Global");
            await client.join(config.sessionName, config.videoSDKJWT, config.userName, config.sessionPasscode);

            const stream = client.getMediaStream();
            setMediaStream(stream);

            await stream.startVideo({videoElement});
            await stream.startAudio();

            setIsVideoOn(true);
            setIsAudioMuted(false);
            setMeetingStarted(true);
        } catch (err) {
            console.error('Error in joinSession:', err);
        }
    };

    const toggleVideo = () => {
        const videoElement = document.getElementById("zoom-video");
        if (!mediaStream || !videoElement) return;

        if (isVideoOn) {
            mediaStream.stopVideo();
            setIsVideoOn(false);
        } else {
            mediaStream.startVideo({videoElement});
            setIsVideoOn(true);
        }
    };

    const toggleAudio = () => {
        if (!mediaStream) return;

        if (isAudioMuted) {
            mediaStream.unmuteAudio();
            setIsAudioMuted(false);
        } else {
            mediaStream.muteAudio();
            setIsAudioMuted(true);
        }
    };

    const toggleUserList = () => {
        // Toast removed: implement as needed
    };

    const toggleSettings = () => {
        // Toast removed: implement as needed
    };

    return {
        getVideoSDKJWT,
        toggleVideo,
        toggleAudio,
        toggleUserList,
        toggleSettings,
        client
    };
};

export default useZoomVideoTest;
