// TODO:: break this file up into smaller pieces for each component. Keep it manageable.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Identicon from './components/Identicon'
import PriceTable from './components/PriceTable'
import Withdraw from './Containers/Withdraw.js'
// import Send from './Containers/Send.js'
import RequestWithdraw from './Containers/RequestWithdraw.js'
import { userType } from './reducers/initialState'
import Loading from './components/Loading'

const TopBar = ({ price }) => {
  const {
    tokens: {
      fund
    },
    ether
  } = price

  // TODO:: get this from their api
  const totalSupply = 40630596.65
  const marketCap = (totalSupply / fund.tokensPerEther) * ether.price
  const updatedTime = Math.floor((Date.now() - ether.last_updated) / 60000)

  return (
    <div className="row"  style={{ backgroundRepeat:'no-repeat', backgroundImage:"url('/image/logo.png')", backgroundPositionX:'10px', marginTop:'20px'}}>
      <div className="col-xs-4">
      </div>
      <div className="col-xs-8 text-right">
        <div className="updated">updated {updatedTime} minutes ago..</div>
        <div className="price-big"></div>
        <div className="QuantFund">{totalSupply}<small> IN CIRCULATION</small></div>
        <div className="QuantFund">${marketCap}<small> MARKET CAP</small></div>
      </div>
    </div>
  )
}

const PriceUpdateStatus = ({ updateTicker }) =>
  <div className="row">
    <div className="col-xs-12">
      <h6>NEXT QUANTFUND PRICE UPDATE: <small>(UPDATED HOURLY)</small></h6>
      <div className="progress" style={{ backgroundColor: '#f5f5f5', margin: '10px 0' }}>
        {updateTicker.minute === 60 ?
          <div className="progress-bar" data-original-title="Pending update, waiting for confirmation from Ethereum." data-placement="top" data-toggle="tooltip" role="progressbar" style={{ width: '100%', backgroundColor: '#003049' }}>Pending update, waiting for confirmation from Ethereum.</div>
          : <div className="progress-bar" data-original-title={updateTicker.minute + "Minutes Till Next QUANTFUND Price Update"} data-placement="top" data-toggle="tooltip" role="progressbar" style={{ width: 100 * Math.max(0, updateTicker.minute) / 60 + '%', backgroundColor: '#003049' }}>
            {60 - updateTicker.minute} Mins left
          </div>
        }
      </div>
    </div>
  </div>

const Step = ({ number, caption }) =>
  <ul className="list-group" style={{ marginBottom: '10px' }}>
    <li className="list-group-item" style={{ color: '#303036', backgroundColor: '#f5f5f5', wordWrap: 'break-word' }}>
      <b>
        <a>{/*TODO:: add link to relevent help/explanation of this step*/}
          <div className="circle-small">
            <i className="fa fa-money"></i>
          </div>
          <div className="step-item">STEP {number}: <span>{caption}</span></div>
        </a>
      </b>
    </li>
  </ul>

const WitdrawSteps = ({ level }) => { // Level 1, 2 and 3 correspond to the 3 user types
  return (
    <div>
      <div className='row'>
        <div className={((level !== 1) ? ' is-disabled' : '')}>
          { /* <Step number={1} level={level} /> */}
        </div>
        <RequestWithdraw isDisabled={level !== 1} />
      </div>
      <div className={'row' + (level !== 2 ? ' is-disabled' : '')}>
        { /* <Step number={2} level={level} />
          <h5>Wait for a price update before you can enact your withdrawal.</h5>
          <p>You will never have to wait longer than 1 hour, since price updates occur hourly.</p>
          */}
      </div>
      { /*
          <div className={'row' + (level !== 3 ? ' is-disabled' : '')}>
          <Step number={3} level={level} />
          <Withdraw/>
        </div>
          */}
    </div>
  )
}

const Body = ({ usersType, address, price }) => {
  return <div className="row">
    <div className="row">
      <div className="col-sm-12">
        <h4>Your QUANT ETH address:</h4>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Identicon diameter={40} address={address} />
          <h5 style={{ paddinLeft: '2em' }}>{address}</h5>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-xxs-6 col-xxs-push-3 col-xs-4 col-xs-push-0">
      </div>
      <PriceTable price={price} />
    </div>
    <div className="row">
      {

        (userType === userType.UNKNOWN ?
          <div>
            <h1>Loading your info and permissions.</h1>
            <Loading size={'50px'} />
          </div>
          : <WitdrawSteps level={usersType === userType.REQUEST_WITHDRAW ? 1 : usersType === userType.WATING_FOR_PRICE_UPDATE ? 2 : usersType === userType.WITHDRAW_ETH ? 3 : -1} />)
      }
      {/*<Send/>*//*Disabled for this release*/}
    </div>
  </div>
}

class App extends Component {
  render() {
    return (
      <div className="col-xs-12 col-sm-12 col-lg-8 col-lg-push-2">
        {
        /* for test
        (parseInt(this.context.web3.version.network, 10) !== 1) &&
          <div className="panel">
            <h1 className="ui-state-error">Warning: You are on a TEST network.</h1>
            <h4>You will not interact with the live QUANTFUND Token.</h4>
          </div>
          **/
        }
        <div className="panel">
          <div className="">
            <div className="row">
              <div className="col-sm-12 col-md-12" >
                <div className="row">
                  <TopBar price={this.props.price} />
                  <PriceUpdateStatus updateTicker={this.props.updateTicker} />
                  {
                    (this.props.user && this.props.user.isWhitelistLoaded) ?
                      (this.props.user.address === '0x0000000000000000000000000000000000000000' ?
                        <div>
                          <h2>We are unable to retrieve your address details.</h2>
                          <p>Please make sure your MetaMask is unlocked.</p>
                          <p>You may need to refresh this page in the browser.</p>
                        </div>
                        :
                        (this.props.user.isWhitelisted ?
                          <Body usersType={this.props.user.userType} address={this.props.user.address} price={this.props.price} />
                          :
                          <div>
                            <h2>The selected address has not been whitelisted:</h2>
                            <h4> {this.props.user.address} </h4>
                            <h3>This functionality is disabled for the above address.</h3>
                            <p>Only whitelisted accounts can use this functionality. Either select a different whitelisted Metamask address or verify your account and then whitelist your Metamask address.</p>
                          </div>
                        )
                      )
                      :
                      <div>
                        <h3>Loading Whitelist information</h3>
                        <p>Only whitelisted accounts can use this functionality.</p>
                        <Loading size={'50px'} />
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
}

App.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  c20Instance: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  price: state.price,
  updateTicker: state.updateTicker,
})

export default connect(mapStateToProps)(App)
