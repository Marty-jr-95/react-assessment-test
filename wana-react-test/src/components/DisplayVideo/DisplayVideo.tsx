import React from 'react'
import ReactPlayer from 'react-player';
interface Props {
  fileUrl: string;
}

const DisplayVideo: React.FC<Props> = (props) => {
  const { fileUrl } = props;
  return (
    <ReactPlayer url={fileUrl} controls={true} width="100%" height="100%" />
  );
}

export default DisplayVideo