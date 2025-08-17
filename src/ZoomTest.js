import React, {useContext, useState, useEffect, useRef} from 'react';
import {NotificationContext} from "./contexts/NotificationContextProvider";
import useZoomVideoTest from "./hooks/useZoomVideoTest";
import {Button} from "antd";
import {
    AudioOutlined,
    FullscreenExitOutlined, FullscreenOutlined,
    SettingOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

// Simple translation object as a placeholder
const translations = {
    'notification.click_the_join_meeting': 'Click the button to join the meeting',
    'profile.start_meeting': 'Start Meeting',
};

const ZoomTest = () => {
    // Replace useTranslations with a simple function
    const t = (key) => translations[key] || key;

    const {meetingStart, dataId} = useContext(NotificationContext);
    const [meetingStarted, setMeetingStarted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const mediaStreamRef = useRef(null);
    const clientRef = useRef(null);

    const config = {
        videoSDKJWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiM211ZFY5dlQ2dkwzWjJ1WFBic3ZIRERTeEpNVzFLbUdjZENsIiwicm9sZV90eXBlIjowLCJ0cGMiOiJBUzI1MDgxNzAzIiwidmVyc2lvbiI6MSwiaWF0IjoxNzU1NDAzMDQ0LjEsImV4cCI6MTc1NTQzOTA0NC4xfQ.o9DPg2iwbtXq7nNw3meLMgbhOTsx4nhL1X6P3uLC8pA",
        sessionName: "AS25081703",
        userName: "Shah Jalal",
        sessionPasscode: "123",
        features: [
            "preview",
            "video",
            "audio",
            "settings",
            "recording",
            "users",
            "share",
            "fullscreen",
            "viewMode"
        ],
        options: {
            init: {},
            audio: {},
            share: {},
            recording: {},
            settings: {},
            fullscreen: {
                showFeatureBar: true
            },
            video: {
                mirror: false,
                resolution: "high",
                frameRate: 30,
                autoResize: true
            },
            viewMode: "gallery"
        },
        virtualBackground: {
            allowVirtualBackground: true,
            allowVirtualBackgroundUpload: true,
            virtualBackgrounds: [
                "https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop"
            ]
        }
    };

    // Get mediaStream and client from the hook after meeting started
    const {
        getVideoSDKJWT,
        toggleAudio,
        toggleVideo,
        toggleUserList,
        toggleSettings,
        client
    } = useZoomVideoTest(null, dataId, setMeetingStarted, meetingStart, config);

    // Store client and mediaStream in refs for event handlers
    useEffect(() => {
        if (client) clientRef.current = client;
    }, [client]);

    useEffect(() => {
        if (!meetingStarted || !clientRef.current) return;
        const c = clientRef.current;
        // Listen for user-added and user-removed events
        const handleUserAdded = (user) => {
            setRemoteUsers((prev) => {
                if (prev.find(u => u.userId === user.userId)) return prev;
                return [...prev, user];
            });
        };
        const handleUserRemoved = (user) => {
            setRemoteUsers((prev) => prev.filter(u => u.userId !== user.userId));
        };
        c.on('user-added', handleUserAdded);
        c.on('user-removed', handleUserRemoved);
        // Add existing remote users (in case already present)
        setRemoteUsers(c.getAllUser().filter(u => !u.isHost));
        return () => {
            c.off('user-added', handleUserAdded);
            c.off('user-removed', handleUserRemoved);
        };
    }, [meetingStarted]);

    // Render remote video when remoteUsers or meetingStarted changes
    useEffect(() => {
        if (!meetingStarted || !clientRef.current) return;
        const c = clientRef.current;
        const ms = c.getMediaStream();
        mediaStreamRef.current = ms;
        remoteUsers.forEach(user => {
            const el = document.getElementById(`remote-video-${user.userId}`);
            if (el && ms) {
                try {
                    ms.renderVideo(el, user.userId, 320, 240, 0, 0, 3);
                } catch (e) {
                    // Ignore if already rendering
                }
            }
        });
    }, [remoteUsers, meetingStarted]);

    const handleFullScreenToggle = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    return (
        <div className="border border-neutral65 rounded mt-9">
            <div className="px-4 py-6">
                <div className="p-6 rounded h-[500px] flex flex-col justify-between items-center">
                    {!meetingStarted && (
                        <>
                            <p className="text-white mb-4">{t("notification.click_the_join_meeting")}</p>
                            <Button type="primary" onClick={getVideoSDKJWT}>
                                {t("profile.start_meeting")}
                            </Button>
                        </>
                    )}

                    <div className="w-full h-[400px] mt-4 relative">
                        <div id="join-flow"
                             className="w-full h-full border border-newPrimaryNew flex justify-center items-center">
                            <video
                                id="zoom-video"
                                autoPlay
                                muted
                                playsInline
                                style={{width: "100%", height: "100%", objectFit: "cover"}}
                            />
                            {/* Render remote user videos */}
                            {remoteUsers.map(user => (
                                <video
                                    key={user.userId}
                                    id={`remote-video-${user.userId}`}
                                    autoPlay
                                    playsInline
                                    style={{width: 320, height: 240, objectFit: 'cover', position: 'absolute', top: 0, right: 0, zIndex: 10}}
                                />
                            ))}
                        </div>
                    </div>

                    {meetingStarted && (
                        <div className="flex gap-4 mt-4">
                            <Button icon={<VideoCameraOutlined/>} onClick={toggleVideo}>Video</Button>
                            <Button icon={<AudioOutlined/>} onClick={toggleAudio}>Audio</Button>
                            <Button icon={<UserOutlined/>} onClick={toggleUserList}>Users</Button>
                            <Button icon={<SettingOutlined/>} onClick={toggleSettings}>Settings</Button>
                            <Button
                                icon={isFullScreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
                                onClick={handleFullScreenToggle}
                            >
                                {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ZoomTest;
