import React from 'react'



class Icon extends React.Component {
  
  translate() {
    return <React.Fragment><path fill="none" d="M0 0h24v24H0V0z"/><polygon points="19.09 8.17 17.67 9.59 19.09 11 13 11 13 4.91 14.41 6.33 15.83 4.91 12 1.09 8.17 4.91 9.59 6.33 11 4.91 11 11 4.91 11 6.33 9.59 4.91 8.17 1.09 12 4.91 15.83 6.33 14.41 4.91 13 11 13 11 19.09 9.59 17.67 8.17 19.09 12 22.91 15.83 19.09 14.41 17.67 13 19.09 13 13 19.09 13 17.67 14.41 19.09 15.83 22.91 12 19.09 8.17"/></React.Fragment>
  }
  
  rotate() {
    return <React.Fragment><path fill="none" d="M0 0h24v24H0V0z"/><path d="M7.26,6.11.36,13l6.9,6.9L14.17,13ZM3.19,13,7.26,8.94,11.34,13,7.26,17.09Z"/><path d="M13.25,3.78l-.37,0L14.73,2,13.31.54,9.08,4.78,13.31,9,14.73,7.6,12.92,5.8l.33,0a7.49,7.49,0,1,1-2.9,14.39l-1.5,1.49a9.37,9.37,0,0,0,4.4,1.09,9.49,9.49,0,1,0,0-19Z"/></React.Fragment>
  }
  
  
  scale() {
    return <React.Fragment><path fill="none" d="M0 0h24v24H0V0z"/><path d="M5.14,1.14V13.41H1.26V23h9.61V19.14H23.14v-18Zm4,18v2.13H3V15.15H9.13v4Zm12-2H10.87V13.41H7.14V3.14h14Z"/><polygon points="12.96 12.45 17 8.41 17 11 19 11 19 5 13 5 13 7 15.59 7 11.55 11.04 12.96 12.45"/></React.Fragment>
  }

  phone() {
    return <React.Fragment><path d="M5.3.55v21.9H18.7V.55Zm11.5,20H7.2V19h9.6Zm0-3.5H7.2V6h9.6Zm0-13H7.2V2.45h9.6Z"/><polygon points="11 10.91 11 15.26 13 15.26 13 10.91 14.41 12.33 15.83 10.91 12 7.09 8.17 10.91 9.59 12.33 11 10.91"/></React.Fragment>
  }
  
  
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}>{this[this.props.icon]()}</svg>
  }
  
}


export default Icon;  