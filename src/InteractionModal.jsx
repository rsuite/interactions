import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal } from 'rsuite';

function InteractionModal({
  okButtonText = '确定',
  okButtonProps,
  onOk,
  showCancelButton = true,
  cancelButtonText = '取消',
  onCancel,
  children,
  canCancelOnLoading = false,
  modalProps = {},
}) {
  const [shouldShowModal, setShouldShowModal] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleReturnValueOfOnOk = useCallback((returnValueOfOnOk) => {
    if (!returnValueOfOnOk || !returnValueOfOnOk.then) {
      setShouldShowModal(false);
      return;
    }

    setSubmitLoading(true);
    returnValueOfOnOk.finally(() => {
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
    // pass current loading status to onCancel to distinguish different case
    onCancel && onCancel(submitLoading);
  }, [onCancel, submitLoading]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOk();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (showCancelButton) {
          handleCancel();
        } else {
          handleOk();
        }
      }

      // Prevent focus change
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    }

    if (shouldShowModal) {
      document.addEventListener('keydown', handleKeyDown, false);

      return () => {
        document.removeEventListener('keydown', handleKeyDown, false);
      };
    }
  }, [shouldShowModal, handleOk, handleCancel, showCancelButton]);

  return (
    <Modal
      role="alertdialog"
      size="xs"
      aria-describedby="alertdialog-description"
      open={shouldShowModal}
      {...modalProps}
    >
      <Modal.Body id="alertdialog-description">{children}</Modal.Body>
      <Modal.Footer>
        {showCancelButton && (
          <Button
            disabled={submitLoading && !canCancelOnLoading}
            onClick={handleCancel}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          loading={submitLoading}
          onClick={handleOk}
          appearance="primary"
          {...okButtonProps}
        >
          {okButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InteractionModal;
