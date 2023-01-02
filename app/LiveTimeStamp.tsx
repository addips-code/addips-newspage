"use client";
import Timeago from "react-timeago";

type Props = {
    time: string;
};

function LiveTimestamp({ time}: Props){
    return <Timeago date={time} />;
}

export default LiveTimestamp;