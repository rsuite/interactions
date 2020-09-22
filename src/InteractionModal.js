import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'rsuite';

function InteractionModal({
  okButtonText = '确定',
  onOk,
  showCancelButton = true,
  cancelButtonText = '取消',
  onCancel,
  children,
}) {
  const [shouldShowModal, setShouldShowModal] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleReturnValueOfOnOk = useCallback(returnValueOfOnOk => {
    if (!returnValueOfOnOk || !returnValueOfOnOk.then) {
      setShouldShowModal(false);
      return;
    }

    setSubmitLoading(true);
    returnValueOfOnOk
      .finally(() => {
        setSubmitLoading(false);
        setShouldShowModal(false);
      });
  }, []);

  const handleOk = useCallback(() => {
    const returnValueOfOnOk = onOk && onOk();
    handleReturnValueOfOnOk(returnValueOfOnOk);
  }, [onOk, handleReturnValueOfOnOk]);

  const handleCancel = useCallback(() => {
    setShouldShowModal(false);
    onCancel && onCancel();
  }, [onCancel]);

  return (
    <Modal size="xs" show={shouldShowModal}>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button loading={submitLoading} onClick={handleOk} appearance="primary">
          {okButtonText}
        </Button>
        {showCancelButton && (
          <Button onClick={handleCancel}>{cancelButtonText}</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default InteractionModal;
