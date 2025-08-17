import React, {useContext, useState} from 'react';
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {NotificationContext} from "@/contexts/NotificationContextProvider";
import useZoomVideoTest from "@/hooks/useZoomVideoTest";
import {Button} from "antd";
import {
    AudioOutlined,
    FullscreenExitOutlined, FullscreenOutlined,
    SettingOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

const ZoomTest = () => {
    const t = useTranslations();
    const router = useRouter();

    const {meetingStart, isMeetingStart, dataId} = useContext(NotificationContext);
    const [meetingStarted, setMeetingStarted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const config = {
        videoSDKJWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiM211ZFY5dlQ2dkwzWjJ1WFBic3ZIRERTeEpNVzFLbUdjZENsIiwicm9sZV90eXBlIjowLCJ0cGMiOiJBUzI1MDgxNzAzIiwidmVyc2lvbiI6MSwiaWF0IjoxNzU1NDAzMDQ0LjEsImV4cCI6MTc1NTQzOTA0NC4xfQ.o9DPg2iwbtXq7nNw3meLMgbhOTsx4nhL1X6P3uLC8pA",
        sessionName: "AS25081703",
        userName: "",
        sessionPasscode: "123",
    };

    const {
        getVideoSDKJWT,
        toggleAudio,
        toggleVideo,
        toggleUserList,
        toggleSettings
    } = useZoomVideoTest(null, dataId, setMeetingStarted, meetingStart, config);

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

