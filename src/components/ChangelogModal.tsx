import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactMarkdown from 'react-markdown'
import { NotificationOutlined } from '@ant-design/icons';
import changelogMd from '../changelog.md';

function ChangelogModal () {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [md, setMD] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
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
        <Button
          style={{
            position: 'fixed',
            bottom: 10,
            left: 10,
          }}
          icon={<NotificationOutlined />}
          type="primary"
          shape="round"
          onClick={showModal}
          ghost
          >What's New?</Button>


        <Modal
        title="Changelog"
        visible={isModalVisible}
        onOk={handleClose}
        onCancel={handleClose}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
        >
          <ReactMarkdown children={md}></ReactMarkdown>
        </Modal>
        </>
        )
}

export default ChangelogModal


