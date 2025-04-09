"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolModal = void 0;
var Close_1 = require("@mui/icons-material/Close");
var material_1 = require("@mui/material");
var ToolModal_style_1 = require("./ToolModal.style");
var ToolModal = function (_a) {
    var title = _a.title, open = _a.open, setOpen = _a.setOpen, data = _a.data;
    var handleOpenToolModal = function (e) {
        e.stopPropagation();
        setOpen(false);
    };
    var handleCloseToolModal = function (e) {
        e.stopPropagation();
        setOpen(false);
    };
    return (<material_1.Modal disableAutoFocus={true} open={open} onClick={handleOpenToolModal} onClose={handleCloseToolModal} sx={{ zIndex: 1700 }} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <ToolModal_style_1.ModalContainer className="modal-container">
        <ToolModal_style_1.ModalHeaderAppBar>
          <ToolModal_style_1.ToolModalTitle id="modal-modal-title" variant={'headerXSmall'} as="h3">
            {title}
          </ToolModal_style_1.ToolModalTitle>
          <ToolModal_style_1.ToolModalIconButton aria-label="close modal" onClick={handleCloseToolModal}>
            <Close_1.default />
          </ToolModal_style_1.ToolModalIconButton>
        </ToolModal_style_1.ModalHeaderAppBar>
        <ToolModal_style_1.ModalContent container>
          {data === null || data === void 0 ? void 0 : data.map(function (el, index) {
            return (<ToolModal_style_1.ToolModalGrid key={"".concat(title, "-item-").concat(index)}>
                <ToolModal_style_1.ToolModalAvatar src={el.logoURI}/>
                <ToolModal_style_1.ToolModaItemlTitle variant={'bodyXSmall'}>
                  {el.name}
                </ToolModal_style_1.ToolModaItemlTitle>
              </ToolModal_style_1.ToolModalGrid>);
        })}
        </ToolModal_style_1.ModalContent>
      </ToolModal_style_1.ModalContainer>
    </material_1.Modal>);
};
exports.ToolModal = ToolModal;
