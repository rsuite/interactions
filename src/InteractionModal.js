import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal } from 'rsuite';

function InteractionModal({
  okButtonText = '确定',
  onOk,
  showCancelButton = true,
  cancelButtonText = '取消',
  onCancel,
  children,
  canCancelOnLoading = false,
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
    }

    if (shouldShowModal) {
      document.addEventListener('keydown', handleKeyDown, false);

      return () => {
        document.removeEventListener('keydown', handleKeyDown, false);
      };
    }
  }, [shouldShowModal, handleOk, handleCancel, showCancelButton]);

  /**
   * using open/show judge by rsuite version
   * @example @3 propTypes undefined
   * @example @4 no 'open' in propTypes
   * @example @4 'open' in propTypes
   */
  const modalProps = {
    [Modal.propTypes && 'open' in Modal.propTypes
      ? 'open'
      : 'show']: shouldShowModal,
  };

  return (
    <Modal
      role="alertdialog"
      size="xs"
      aria-describedby="alertdialog-description"
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
        <Button loading={submitLoading} onClick={handleOk} appearance="primary">
          {okButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InteractionModal;
