import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ClientLayout from '../../layouts/ClientLayout';
import VoiceSelector from '../../components/client/VoiceSelector';
import TextEditor from '../../components/client/TextEditor';
import AudioHistory from '../../components/client/AudioHistory';
import { fetchVoices, fetchAudioHistory } from '../../redux/slices/ttsSlice';
import { fetchClientMe } from '../../redux/slices/authSlice';
import { clientService } from '../../services/clientService';

export default function StudioPage() {
  const dispatch = useDispatch();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    dispatch(fetchClientMe());
    dispatch(fetchVoices());
    dispatch(fetchAudioHistory());
    
    clientService.getPageContent('studio')
      .then(res => {
        if (res.data?.page) setPageData(res.data.page);
      })
      .catch(err => console.error("Lỗi lấy nội dung Studio:", err));
  }, [dispatch]);

  return (
    <ClientLayout>
      <div className="app-main">
        <VoiceSelector pageData={pageData} />
        <TextEditor pageData={pageData} />
        <AudioHistory pageData={pageData} />
      </div>
    </ClientLayout>
  );
}
