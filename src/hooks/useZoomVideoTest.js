import {useContext, useState} from "react";
import ZoomVideo from "@zoom/videosdk";
import {ZoomContext} from "@/contexts/ZoomContextProvider";
import useProfileFullName from "@/hooks/useProfileFullName";
import {Toast} from "@/components/common/Toast";

const useZoomVideoTest = (meeting, dataId, setMeetingStarted, handleMeetingStart, config) => {
    const {generateZoomToken} = useContext(ZoomContext);
    const username = useProfileFullName();

    const [client] = useState(() => ZoomVideo.createClient());
    const [mediaStream, setMediaStream] = useState(null);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    const getVideoSDKJWT = async (e) => {
        e.preventDefault?.(); // in case e is Event
        handleMeetingStart();

        config.userName = username;
        config.sessionName = "zoom_" + Date.now();

        const body = {
            sessionName: config.sessionName,
            role: 0,
        };

        config.sessionName = "AS25081703";
        config.videoSDKJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiM211ZFY5dlQ2dkwzWjJ1WFBic3ZIRERTeEpNVzFLbUdjZENsIiwicm9sZV90eXBlIjowLCJ0cGMiOiJBUzI1MDgxNzAzIiwidmVyc2lvbiI6MSwiaWF0IjoxNzU1NDAzMDQ0LjEsImV4cCI6MTc1NTQzOTA0NC4xfQ.o9DPg2iwbtXq7nNw3meLMgbhOTsx4nhL1X6P3uLC8pA";
        await joinSession();
    };

    const joinSession = async () => {
        const videoElement = document.getElementById("zoom-video");
        if (!videoElement) {
            Toast("error", "Zoom", "Video element not found.");
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
        Toast("info", "Participants", "Show participant list (not yet implemented)");
    };

    const toggleSettings = () => {
        Toast("info", "Settings", "Open settings panel (not yet implemented)");
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

