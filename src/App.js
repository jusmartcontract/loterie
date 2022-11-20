import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "Bienvenue!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "Un gagnant à été tiré!" });
  };

  render() {
    return (
      <div>
        <h2>La loterie qui poutre</h2>
        <p>
          Ce jeux de loterie est géré par Ju {this.state.manager}. Il y a actuellement {" "}
          {this.state.players.length} personnes d'entrée en jeux, le pool à gagner est de{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Tu veux tenter ta chance ?</h4>
          <div>
            <label>Montant d'ETH à miser</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Selection du winner?</h4>
        <button onClick={this.onClick}>And the winner is ........</button>

        <hr />
        
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
