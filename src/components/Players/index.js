import React, { Component } from "react";
import "../../assets/styles/player-index.css";
import loader from "../../assets/player-images/loader.gif";
export default class Players extends Component {
  componentDidMount() {
    // Call the function to get player list from given API
    this.getPlayerData();
  }
  //initialie the state
  state = {
    playerList: [],
    searchString: "",
    isLoading: true,
  };
  /**
   *@description Calls the given API endpoint to get the player data and then format it to display
   */
  getPlayerData = async () => {
    //init an empty player list array to store data coming from the endpoint
    let playerList = [];
    await fetch("https://api.npoint.io/d6bd0efc05639084eb17/")
      .then((response) => response.json())
      .then((data) => (playerList = data.playerList));
    //declare an empty array to store formatted player data
    this.setState({ ...this.state, isLoading: false });
    let formattedList = [];
    //loop through the objects
    for (var i = 0; i < playerList.length; i++) {
      //init empty player object
      let playerObject = {};
      //assign values
      playerObject.PFName = playerList[i].PFName;
      playerObject.SkillDesc = playerList[i].SkillDesc;
      playerObject.Value = playerList[i].Value;
      playerObject.Id = playerList[i].Id;
      playerObject.UpcomingMatch = {
        teams: {
          team1: playerList[i].UpComingMatchesList[0].CCode
            ? playerList[i].UpComingMatchesList[0].CCode
            : "NA",
          team2: playerList[i].UpComingMatchesList[0].VsCCode
            ? playerList[i].UpComingMatchesList[0].VsCCode
            : "NA",
        },
        time: playerList[i].UpComingMatchesList[0].MDate,
      };
      playerObject.TName = playerList[i].TName;
      //append the data in formatted list
      formattedList.push(playerObject);
    }
    //set the state with formatted data values
    this.setState({ ...this.state, playerList: formattedList });
  };

  /**
   * Checking if an image exist in your image folder
   */
  loadImage = (variable) => {
    let image;
    try {
      image = require(`../../assets/player-images/${variable}.jpg`);
      return image.default;
    } catch (e) {
      image = require("../../assets/player-images/default.jpg");
      return image.default;
    }
  };
  //save search string and display searc based players
  onChange = (event) => {
    this.setState({ ...this.state, searchString: event.target.value });
  };
  render() {
    let stateList = this.state.playerList;
    let filteredList = stateList.filter((player) => {
      return (
        player.PFName.toLowerCase().indexOf(
          this.state.searchString.toLowerCase()
        ) !== -1 ||
        player.TName.toLowerCase().indexOf(
          this.state.searchString.toLowerCase()
        ) !== -1
      );
    });
    return (
      <div className="main-container">
        <div className="player-list-header">
          <div>
            <h2>Players</h2>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for a player"
              onChange={(event) => {
                this.onChange(event);
              }}
            />
          </div>
        </div>
        {this.state.isLoading ? (
          <div className="loader">
            <img src={loader} />
          </div>
        ) : (
          <></>
        )}
        <div className="player-grid">
          {/* map the players here */}
          {filteredList
            //sort the player list in ascending order of Value
            .sort((a, b) =>
              parseFloat(a.Value) < parseFloat(b.Value) ? -1 : 1
            )
            .map((player, index) => (
              <div className="player-card" key={`player-card-${index}`}>
                {/* player image container */}
                <div className="player-image">
                  {<img src={this.loadImage(player.Id)} />}
                </div>
                <div className="player-details">
                  <div className="name-skill">
                    <div>Name : {player.PFName}</div>
                    <div>Skill : {player.SkillDesc}</div>
                    <div>Value : $ {player.Value} bn</div>
                  </div>
                </div>
                <div className="upcoming-container">
                  <div>
                    <h3>Upcoming Match</h3>
                    <div className="match">
                      {player.UpcomingMatch.teams.team1 +
                        " vs " +
                        player.UpcomingMatch.teams.team2}
                    </div>
                  </div>
                  <div className="date-time">
                    <h3>Date</h3>
                    {/* date of the match */}
                    {player.UpcomingMatch.time
                      ? new Date(player.UpcomingMatch.time).toLocaleString(
                          //get current locale from browser
                          navigator.language
                        )
                      : "NA"}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
