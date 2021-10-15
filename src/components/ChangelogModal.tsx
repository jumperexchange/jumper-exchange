import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactMarkdown from 'react-markdown'
import { NotificationOutlined } from '@ant-design/icons';
import {storeHideChangelog, readHideChangelog} from '../services/localStorage'
import changelogMd from '../changelog.md';

function ChangelogModal () {

  const [isModalVisible, setIsModalVisible] = useState(readHideChangelog());
  const [md, setMD] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    storeHideChangelog(true)
  };
  useEffect(() => {
    fetch(changelogMd)
        .then(data => data.text())
        .then(text => {
            setMD(text);
        })
  }, []);

  return (
        <>
        <div style={{
          position: 'fixed',
          bottom: 0,
          left:0,
          padding: '10px 20px 10px 20px',
          background: 'white',
        }}>
          <Button
           icon={<NotificationOutlined />}
           type="primary"
           onClick={showModal}
           ghost
           >What's New?</Button>
        </div>


        <Modal
        title="Changelog"
        visible={isModalVisible}
        onOk={handleOk}
        okText="Close"
        onCancel={handleCancel}
        cancelText="Don't Show Again"
        >
          <ReactMarkdown children={md}></ReactMarkdown>
        </Modal>
        </>
        )
}

export default ChangelogModal


