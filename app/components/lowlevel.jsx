'use strict';

import React, {Component} from 'react';

export class TabHeading extends Component {

  render() {
    return (
    <div style={{width: "100%", height: "70px"}}>
    <section style={{position: "fixed",  top: 0,  right: 0, left: 0, zIndex: 3}}>
      <div className="anchor anchor--rec-home">
        <div className="grid grid--align-spread">
          <div className="media col media--rec-home">
            <div className="media__figure">
              <SvgIcon svgClass={"icon icon--large  icon-standard-"+this.props.icon} useHref={"/assets/icons/standard-sprite/svg/symbols.svg#"+this.props.icon}/>
            </div>
            <div className="media__body">
              <p className="text-heading--label">{this.props.subtitle}</p>
              <div className="grid">
                <div className="col">
                  <h1 className="text-heading--medium media--rec-home__title truncate">{this.props.title}</h1>
                </div>
                { this.props.follow &&
                <div className="col shrink-none align-bottom">
                  <button className="button button--neutral not-selected" aria-live="assertive">
                    <span className="text-not-selected">
                      <SvgIcon svgClass="button__icon--stateful button__icon--left" useHref="/assets/icons/utility-sprite/svg/symbols.svg#add"/>
                      Follow
                    </span>
                  </button>
                </div>
              }
              </div>
            </div>
          </div>
          <div className="col shrink-none align-bottom">
            <div className="button-group" role="group">
              <button className="button button--neutral">Action 1</button>
              <button className="button button--neutral">Action 2</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  )
  }
}
TabHeading.propTypes = { icon: React.PropTypes.string, title: React.PropTypes.string, subtitle: React.PropTypes.string, follow: React.PropTypes.bool };
TabHeading.defaultProps = { icon: "user", title: "", subtitle: "record type", follow: false};

export  class SvgIcon extends Component {
  render() {
    return (
      <svg className={this.props.svgClass}
        dangerouslySetInnerHTML={{__html: "<use xlink:href='"+this.props.useHref+"' />"}}>
      </svg>
  )}
}
