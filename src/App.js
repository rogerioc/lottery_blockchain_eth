import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
class App extends Component {
  /*constructor(props) {
    super(props);
    this.state = {manager : ''};
  }*/
  state = {
    manager : '',
    players: [],
    balance: '',
    value: '' , 
    message: ''
  };
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); 
    const account = accounts[0];
    this.setState({message:'Waiting on transaction success...'});    
    await lottery.methods.enter().send({
      from: account,
      value: web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:'You have been entered!!'});
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts(); 
    const account = accounts[0];
    this.setState({message:'Waiting on transaction success...'});    
    await lottery.methods.pickWinner().send({
      from: account      
    });
    this.setState({message:'A winner has been picked!'});
  };

  render() {
    //console.log(web3.version); //Get web3 version
    // web3.eth.getAccounts(console.log); //Get eth accounts
    return (
      <div >
       <h2> Lottery Contract </h2>
       <p>
         This contract is manager by {this.state.manager}. There are currently {this.state.players.length} people entered,
         competing to win {web3.utils.fromWei(this.state.balance,'ether')} ether!
         </p>
         <hr />
         <form onSubmit={this.onSubmit}>
           <h4>Want to try your luck?</h4>
           <div>
             <label>Amount ether to enter</label>
             <input
             value={this.state.value}
             onChange={event => this.setState({value : event.target.value })}
             />
           </div>
           <button>Enter</button>
         </form>
         <hr />
         <h4>Ready to pick a winner?</h4>
         <button onClick={this.onClick}>Pick a winner</button>
         <hr />
         <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
