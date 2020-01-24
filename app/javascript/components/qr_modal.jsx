import React from 'react'

import { map, omit } from "lodash"

var QRCode = require('qrcode.react');


class QrModal extends React.Component {


  render() {
    const { spaceId, cabinKey, rootUrl } = this.props;

    const link = `${rootUrl}/link/${spaceId}?cabin_key=${cabinKey}`

    return <div className="modal__wrapper">
      <div className="modal__overlay"></div>
      <div className="modal__modal modal__modal--qr">
        <div className='modal__title'>Preview this Space</div>
        View this QR Code on an iOS with CabinAR installed.

       <div className='modal__qr'><QRCode value={link} renderAs="svg" size={256} /></div>
 
        <div className="modal__actions">
          <button className="modal__cancel" onClick={this.props.closeQr}>close</button>
        </div>
      </div>
    </div>
  }

}


export default QrModal;