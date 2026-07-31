import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ClientLayout from '../../layouts/ClientLayout';
import VoiceSelector from '../../components/client/VoiceSelector';
import TextEditor from '../../components/client/TextEditor';
import AudioHistory from '../../components/client/AudioHistory';
import { fetchVoices, fetchAudioHistory } from '../../redux/slices/ttsSlice';
import { fetchClientMe } from '../../redux/slices/authSlice';

export default function StudioPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClientMe());
    dispatch(fetchVoices());
    dispatch(fetchAudioHistory());
  }, [dispatch]);

  return (
    <ClientLayout>
      <div className="app-main">
        <VoiceSelector />
        <TextEditor />
        <AudioHistory />
      </div>
    </ClientLayout>
  );
}
