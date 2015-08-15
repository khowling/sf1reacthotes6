'use strict';

import React, {Component} from 'react';
import Velocity from 'velocity-animate';
import ProgressBar from 'progressbar.js'
import 'velocity-animate/velocity.ui';

import {TabHeading, SvgIcon} from './lowlevel.jsx';

export class MainHome extends Component {

  componentDidMount() {

    var title1 = 'Visits   ',
        progressBar = new ProgressBar.Circle(React.findDOMNode(this.refs.p1), {
          color: '#FCB03C',
          strokeWidth: 5,
          trailWidth: 1,
          duration: 1500,
          text: {
              value: title1 + '0%',
              className: 'progress--label'
          },
          step: function(state, bar) {
              bar.setText(title1 +(bar.value() * 100).toFixed(0) + '%');
          }
      });
    var title2 = 'Surveys ',
        progressBar2 = new ProgressBar.Circle(React.findDOMNode(this.refs.p2), {
          color: '#0070d2',
          strokeWidth: 5,
          trailWidth: 1,
          duration: 1500,
          text: {
            value: title2 + '0%',
            className: 'progress--label'
          },
          step: function(state, bar) {
            bar.setText(title2 +(bar.value() * 100).toFixed(0) + '%');
          }
      });
    var title3 = 'Orders ',
        progressBar3 = new ProgressBar.Circle(React.findDOMNode(this.refs.p3), {
          color: '#3cc2b3',
          strokeWidth: 5,
          trailWidth: 1,
          duration: 1500,
          delay: 6000 ,
          text: {
            value: title3 + '£0',
            className: 'progress--label'
          },
          step: function(state, bar) {
            bar.setText(title3 + '£' + (bar.value() * 10000).toFixed(2) );
          }
      });

    setTimeout(() => {
      progressBar.animate(.65, function() {
        console.log ('coplete');
      })
      progressBar2.animate(.77, function() {
          console.log ('coplete');
        });
      progressBar3.animate(.327623, function() {
        console.log ('coplete');
      });
    }, 0);

    Velocity.animate(
    React.findDOMNode(this.refs.nextappt),
      "callout.flash", { delay: 4000 });

    Velocity.animate(
      React.findDOMNode(this.refs.al1),
      "transition.bounceDownIn",
      { delay: 6000 });

  }

  closeAl1() {
    Velocity.animate(
      React.findDOMNode(this.refs.al1),
      "transition.whirlOut");
  }

  render() {
    return (

      <div>

        <div ref="al1" style={{display: "none", marginTop: "10px"}} className="notify notify--alert notify--error theme--inverse-text theme--alert-texture">
          <button className="button notify__close" onClick={this.closeAl1.bind(this)}>
            <SvgIcon svgClass="button__icon button__icon--inverse" useHref="/assets/icons/utility-sprite/svg/symbols.svg#close"/>
            <span className="assistive-text">Close</span>
          </button>
          <span className="assistive-text">Success</span>
          <h2 >
            <SvgIcon svgClass="icon icon-text-email icon--small m-right--x-small" useHref="/assets/icons/custom-sprite/svg/symbols.svg#custom19"/>
            <span>PRODUCT SHORTAGE ALERT: Sunday March 15, 8:00 AM - 10:00 PST </span><br/>
            <a href="#" >More Information</a>
          </h2>
        </div>

        <div className="card" style={{marginTop: "10px"}}>
          <header className="card__header grid">
            <div className="media media--center has-flexi-truncate">
              <div className="media__figure">
                <SvgIcon svgClass={"icon icon__svg  icon-standard-dashboard "} useHref={"/assets/icons/standard-sprite/svg/symbols.svg#dashboard"}/>
              </div>
              <div className="media__body">
                <h3 className="text-heading--small truncate">How's my week going?</h3>
              </div>
            </div>
          </header>

        <div className="card_inner grid  wrap">

          <div className="col--padded size--1-of-2 medium-size--1-of-3" >
            <figure >
              <div ref="p1" style={{margin: "20px"}}></div>
              <div className="progress--label">Todays Visits</div>
            </figure>
          </div>
          <div className="col--padded size--1-of-2 medium-size--1-of-3">
            <figure >
              <div ref="p2" style={{margin: "20px"}}></div>
              <div className="progress--label">Todays Surveys</div>
            </figure>
          </div>
          <div className="col--padded size--1-of-2 medium-size--1-of-3" >
            <figure >
              <div ref="p3" style={{margin: "20px"}}></div>
              <div className="progress--label">Todays Order Value</div>
            </figure>
          </div>

        </div>
      </div>

        <div className="card" style={{marginTop: "10px"}}>
          <header className="card__header grid">
            <div className="media media--center has-flexi-truncate">
              <div className="media__figure">
                <SvgIcon svgClass={"icon icon__svg  icon-standard-event "} useHref={"/assets/icons/standard-sprite/svg/symbols.svg#event"}/>
              </div>
              <div className="media__body">
                <h3 className="text-heading--small truncate">Next Appointment</h3>
              </div>
            </div>
          </header>

          <div ref="nextappt" className="media tile tile--kanban" >

            <div className="media__figure">
              <span className="avatar avatar--circle avatar--small">
                <img src={"data:image/JPEG;base64,"}/>
              </span>
            </div>
            <div className="media__body">
              <div className="tile">
                <div className="grid wrap">
                  <div className="col size--1-of-1 text-body--regular">
                    <span className="m-left--x-small float-right">
                      <span>today, 12:30am</span>
                    </span>
                    <p className="truncate">
                      <a href="#">John Smth</a>
                    </p>
                  </div>
                  <div className="col text-body--small">
                    <ul className="list--horizontal">
                      <li className="list__item list__item--separator">Category Manager</li>
                      <li className="list__item list__item--separator"></li>
                      <li className="list__item list__item--separator"></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    );
  }
}



export class NavContainer extends Component {
  render() {
    return (

              <section className="site-grid--landing" >
                <ul className="grid wrap" >
                  <NavElement navName="Core1" navClassIcon="standard-case" navIcon="standard-sprite/svg/symbols.svg#case"></NavElement>
                  <NavElement navName="Core2"  navClassIcon="custom-57" navIcon="custom-sprite/svg/symbols.svg#custom57"></NavElement>
                  <NavElement navName="Core3" navClassIcon="custom-19" navIcon="custom-sprite/svg/symbols.svg#custom19"></NavElement>
                </ul>
              </section>
    )
  }
}
export  class NavElement extends Component {


  render() {
    return (

      <li className="col--padded size--1-of-1 small-size--1-of-3 large-size--1-of-3">
        <a href="#">
        <figure >
          <SvgIcon svgClass={"icon icon-"+ this.props.navClassIcon +" icon__svg icon--large icon--circle"} useHref={"/assets/icons/"+this.props.navIcon}/>
          <figcaption >{this.props.navName}</figcaption>
          </figure>
        </a>
      </li>
    );
  }
}

export default class Home extends Component {
  render() {
    return (
      <div>
      <header className=" site-masthead--landing theme--brand text-longform container" style={{paddingTop: "0.6rem",  paddingBottom: "0.6rem" }}>
        <h1 className="text-heading--large">{Home.navProps.name}</h1>
      </header>
      <MainHome/>
    </div>
    )
  }
}
Home.navProps = {name: 'my dashboard', icon: 'dashboard', nav: Home.name, showSync: true};
