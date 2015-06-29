'use strict';

import React, {Component} from 'react';
import { range, seq, compose, map, filter } from 'transducers.js';

import {SvgIcon} from './lowlevel.jsx';
import VelocityTransitionGroup from './utils/VelocityTransitionGroup.jsx';

import SFData from '../service/sfdata.js6';


class TimeLineItem extends Component {

  render() {
    return (
      <li className="timeline__item">
        <span className="assistive-text">{this.props.type}</span>
        <div className="media media--reverse">
          <div className="media__figure">
            <div className="timeline__actions">
              <p className="timeline__date">{this.props.due}</p>
              <button className="button button--icon-border-filled">
                <SvgIcon svgClass="button__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#switch"/>
                <span className="assistive-text">Switch</span>
              </button>
            </div>
          </div>
          <div className="media__body">
            <div className={"media media--timeline timeline__media--"+this.props.type}>
              <div className="media__figure">
                <SvgIcon svgClass="icon icon--medium icon-standard-email" useHref={"/assets/icons/standard-sprite/svg/symbols.svg#"+this.props.type}/>
              </div>
              <div className="media__body">
                <div className="tile">
                  <div className="grid wrap">
                    <div className="col size--1-of-1 text-body--regular">
                      <p className="truncate">
                        <a href="#">{this.props.title}</a>
                      </p>
                    </div>
                  </div>
                </div>
                <p className="truncate">{this.props.desc}</p>
                <ul className="list--horizontal text-body--small">
                  <li className="list__item m-right--large">
                    <dl className="dl--inline">
                      <dt className="dl--inline__label">To:</dt>
                      <dd className="dl--inline__detail">
                        <a href="#">Lei Chan</a>
                      </dd>
                    </dl>
                  </li>
                  <li className="list__item">
                    <dl className="dl--inline">
                      <dt className="dl--inline__label">From:</dt>
                      <dd className="dl--inline__detail">
                        <a href="#">Jason Dewar</a>
                      </dd>
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
}
export default class TimeLine extends Component {

  render() {
    return (
<ul className="timeline">

  <TimeLineItem type="email" title="Updated Proposal" due="Feb 24" desc="Hi guys, Thanks for meeting with the team today and going through the proposals we saw. This goes on
    until it&apos;s truncated."></TimeLineItem>

  <li className="timeline__item">
    <span className="assistive-text">Task</span>
    <div className="media media--reverse">
      <div className="media__figure">
        <div className="timeline__actions">
          <p className="timeline__date">Feb 24</p>
          <button className="button button--icon-border-filled">
            <SvgIcon svgClass="button__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#switch"/>
            <span className="assistive-text">Switch</span>
          </button>
        </div>
      </div>
      <div className="media__body">
        <div className="media media--timeline timeline__media--task">
          <div className="media__figure">
            <SvgIcon svgClass="icon icon--medium icon-standard-task" useHref="/assets/icons/standard-sprite/svg/symbols.svg#task"/>
          </div>
          <div className="media__body">
            <div className="media media--small">
              <div className="media__figure">
                <label className="checkbox" for="checkbox1">
                  <input type="checkbox" value="checkbox" name="checkbox" id="checkbox1"/>
                  <span>
                    <span className="assistive-text">Mark task as complete</span>
                  </span>
                </label>
              </div>
              <div className="media__body">
                <div className="tile">
                  <div className="grid wrap">
                    <div className="col size--1-of-1 text-body--regular">
                      <p className="truncate">
                        <a href="#">Review proposals for EBC deck with larger team and have marketing review this</a>
                      </p>
                    </div>
                    <div className="col text-body--small">
                      <ul className="list--horizontal text-body--small">
                        <li className="list__item m-right--large">
                          <dl className="dl--inline">
                            <dt className="dl--inline__label">Contact:</dt>
                            <dd className="dl--inline__detail">
                              <a href="#">Lei Chan</a>
                            </dd>
                          </dl>
                        </li>
                        <li className="list__item">
                          <dl className="dl--inline">
                            <dt className="dl--inline__label">Assigned to:</dt>
                            <dd className="dl--inline__detail">
                              <a href="#">Betty Mason</a>
                            </dd>
                          </dl>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="timeline__item">
    <span className="assistive-text">Event</span>
    <div className="media media--reverse">
      <div className="media__figure">
        <div className="timeline__actions">
          <p className="timeline__date">Feb 24</p>
          <button className="button button--icon-border-filled">
            <SvgIcon svgClass="button__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#switch"/>
            <span className="assistive-text">Switch</span>
          </button>
        </div>
      </div>
      <div className="media__body">
        <div className="media media--timeline timeline__media--event">
          <div className="media__figure">
            <SvgIcon svgClass="icon icon--medium icon-standard-event" useHref="/assets/icons/standard-sprite/svg/symbols.svg#event"/>
          </div>
          <div className="media__body">
            <p>
              <a href="#">Tesla &#x2014; EBC Meeting</a>
            </p>
            <p className="truncate">Let&apos;s get together to review the theater&apos;s layout and facilities. We&apos;ll also discuss
              potential things that truncate at a certain width.</p>
            <ul className="list--horizontal text-body--small">
              <li className="list__item m-right--large">
                <dl className="dl--inline">
                  <dt className="dl--inline__label">Time:</dt>
                  <dd className="dl--inline__detail">
                    <a href="#">Feb 23, 2015 11:00am - 12:00pm</a>
                  </dd>
                </dl>
              </li>
              <li className="list__item">
                <dl className="dl--inline">
                  <dt className="dl--inline__label">Location:</dt>
                  <dd className="dl--inline__detail">
                    <a href="#">300 Pike St, San Francisco CA</a>
                  </dd>
                </dl>
              </li>
            </ul>
            <dl className="dl--inline text-body--small">
              <dt className="dl--inline__label">Name:</dt>
              <dd className="dl--inline__detail">
                <a href="#">Lei Chan</a>,
                <a href="#">Jason Dewar</a>,
                <a href="#">Gwean Jones</a>and
                <a href="#">Pete Schaffer</a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="timeline__item">
    <span className="assistive-text">Call</span>
    <div className="media media--reverse">
      <div className="media__figure">
        <div className="timeline__actions">
          <p className="timeline__date">Feb 24</p>
          <button className="button button--icon-border-filled">
            <SvgIcon svgClass="button__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#switch"/>
            <span className="assistive-text">Switch</span>
          </button>
        </div>
      </div>
      <div className="media__body">
        <div className="media media--timeline timeline__media--call">
          <div className="media__figure">
            <SvgIcon svgClass="icon icon--medium icon-standard-log-a-call" useHref="/assets/icons/standard-sprite/svg/symbols.svg#log_a_call"/>
          </div>
          <div className="media__body">
            <p>
              <a href="#">Mobile conversation on Monday</a>
            </p>
            <p className="truncate">Lei seemed interested in closing this deal quickly! Let&apos;s move move.</p>
            <ul className="list--horizontal text-body--small">
              <li className="list__item m-right--large">
                <dl className="dl--inline">
                  <dt className="dl--inline__label">Name:</dt>
                  <dd className="dl--inline__detail">
                    <a href="#">Lei Chan</a>
                  </dd>
                </dl>
              </li>
              <li className="list__item">
                <dl className="dl--inline">
                  <dt className="dl--inline__label">Assigned to:</dt>
                  <dd className="dl--inline__detail">
                    <a href="#">Betty Mason</a>
                  </dd>
                </dl>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </li>

</ul>
    )
  }
}
