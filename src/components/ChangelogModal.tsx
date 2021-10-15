import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import ReactMarkdown from 'react-markdown'
import changelogMd from '../changelog.md';


function ChangelogModal () {

  const [isModalVisible, setIsModalVisible] = useState(true); // TODO: get this from localStorage
  const [md, setMD] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
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
  );
}

export default ChangelogModal


