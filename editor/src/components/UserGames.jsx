import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/userGames.css";


const SERVER = "http://127.0.0.1"; // TODO:  delete this when all references r gone
const API_SERVER = "/api/";

const UserGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeGame, setActiveGame] = useState(undefined);
  const [status, setStatus] = useState();
  const [readyForDeletion, setReadyForDeletion] = useState(undefined);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const dummyGames = [
        {
            id: 1,
          title: "The Witcher 3: Wild Hunt",
          description:
            "An epic open-world RPG where you play as Geralt of Rivia, hunting monsters and making choices that shape the world.",
          // image:
          //   "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp",
        },
        {
            id: 2,
          title: "Cyberpunk 2077",
          description:
            "A futuristic open-world action RPG set in the dystopian Night City with cybernetic enhancements and corporate intrigue.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp",
        },
        {
            id: 3,
          title: "Elden Ring",
          description:
            "A challenging action RPG from FromSoftware set in a vast fantasy world created by Hidetaka Miyazaki and George R.R. Martin.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
        },
        {
            id: 4,
          title: "God of War",
          description:
            "Follow Kratos and his son Atreus on their journey through Norse mythology in this action-adventure masterpiece.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.webp",
        },
        {
            id: 5,
          title: "Hades",
          description:
            "A rogue-like dungeon crawler where you play as Zagreus, son of Hades, attempting to escape the underworld.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co39vc.webp",
        },
        {
            id: 6,
          title: "Red Dead Redemption 2",
          description:
            "An immersive western epic following Arthur Morgan and the Van der Linde gang in 1899 America.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
        },
        {
            id: 7,
          title: "The Last of Us Part II",
          description:
            "A post-apocalyptic survival game following Ellie's journey of revenge in a world overrun by infected.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co5ziw.webp",
        },
        {
            id: 8,
          title: "Horizon Zero Dawn",
          description:
            "Explore a beautiful post-apocalyptic world where robotic creatures roam and humanity lives in tribal societies.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co2una.webp",
        },
        {
            id: 9,
          title: "Spider-Man: Miles Morales",
          description:
            "Swing through New York City as Miles Morales discovers his unique spider powers in this action-adventure game.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co2dwe.webp",
        },
        {
            id: 10,
          title: "Assassin's Creed Valhalla",
          description:
            "Lead raids as Eivor, a Viking warrior, and build your settlement in 9th century England.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ed3.webp",
        },
        {
            id: 11,
          title: "Ghost of Tsushima",
          description:
            "Honor dies at the edge of a katana in this samurai adventure set during the Mongol invasion of Japan.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co2crj.webp",
        },
        {
            id: 12,
          title: "Doom Eternal",
          description:
            "Rip and tear through demons in this fast-paced first-person shooter sequel to the 2016 Doom reboot.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p5n.webp",
        },
        {
            id: 13,
          title: "Animal Crossing: New Horizons",
          description:
            "Create your perfect island paradise in this relaxing life simulation game featuring adorable animal villagers.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co3wls.webp",
        },
        {
            id: 14,
          title: "Minecraft",
          description:
            "Build, explore, and survive in this iconic sandbox game with infinite possibilities and creative freedom.",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co8fu7.webp",
        },
      ];

      if (searchParams.get("debug_mode") && searchParams.get("debug_mode") === "true") {
          setGames(dummyGames);
      } else {
          handleGet();
      }
      setLoading(false);
    }, 1000);
  }, []);


  const handleEdit = (game) => {
    console.log(`Editing ${game.id}: ${game.title}`);
    if (!hosting) {
        if (!editing) {
            setEditing(true);
            setActiveGame(game.id);
            startEditContainer(game);
        }
        else {
            stopEditContainer(game);
        }
    }
  };
  const handleHost = (game) => {
        if (!editing) {
            if (!hosting)  {
                setHosting(true);
                setActiveGame(game.id);
                startHostContainer(game);
            }
            else {
                stopHostContainer(game);
            }
        }
  };
  const handleCopyLink = async (game) => {
      if (editing) {
        navigator.clipboard.writeText(getEditURL(game));
      } 
      if (hosting) {
        navigator.clipboard.writeText(getHostURL(game));
      } 
  };
    const handleOpenGame = async (game) => {
        console.log("opening game: " + game.id);
      if (editing) {
       window.location.href = getEditURL(game);
      } 
      if (hosting) {
        window.location.href = getHostURL(game);
      } 
    };
    const getHostURL = (game) => {
        return `/app/${game.id}/`.trim();
    };
  const getEditURL = (game) => {
    return `/editor/${game.id}`.trim();
  };
    const getAPIURL = (game) => {
        return `/api/container/${game.id}/`.trim();
    }

    const stopHostContainer = async(game) => {
        setStatus("Stopping");
    
        fetch(getAPIURL(game), {
            method: "DELETE"
        }).then(() => {
            setStatus("Stopped");
            setHosting(false);
            setActiveGame(undefined);
        });
    }
    
    const startHostContainer = async(game) => {
        setStatus("Starting");

        const token = localStorage.getItem("token");

        fetch(getAPIURL(game) + "play" , {
            method: "POST",
            credentials: "include",
            headers: { 
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            setStatus("Running");
        });

    }
    const stopEditContainer = async(game) => {
        setStatus("Stopping");
    
        fetch(getAPIURL(game), {
            method: "DELETE"
        }).then(() => {
            setStatus("Stopped");
            setEditing(false);
            setActiveGame(undefined);
        });
    }
    
    const startEditContainer = async(game) => {
        setStatus("Starting");


        fetch(getAPIURL(game) + "edit", {
            method: "POST"
        }).then(() => {
            setStatus("Running");
        });

    }
    
  const handleGet = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/getGames", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.text){
        const data = await response.json();
        setGames(data.games);
        if (data.active_games.length > 0) {
            setActiveGame(data.active_games[0]);
            setStatus("Running");
            
            try {
                const res = await fetch ("/app/" + data.active_games[0] + "/server-output-mode",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                res.text().then((text) => {
                    console.log("Game server up, in " + text + "mode")
                    if (text === "edit") {
                        setEditing(true);
                    } else {
                        setHosting(true);
                    }
                });

            } catch (e) {
                console.log(" error: " + e);
            }

        }
        console.log(data.games);
      }
      else{
        console.log("Failed to fetch games");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deleteGame = async (game) => {

        fetch ("/api/container/" + game.id,
            {method:"DELETE"}).then((text) => {
                handleGet();
            });

  };
  const handleCreate = () => {
    console.log("Create button pressed");
    setShowPopup(!showPopup);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Add button pressed");

    const formData = new FormData(event.target);
    const gameTitle = formData.get("gameTitle");
    const gameDescription = formData.get("gameDescription");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/newGame", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Game created successfully");
        handleClosePopup();
        await handleGet();
      } else {
        console.error("Error creating game");
      }
    } catch (error) {
      console.error("Error during game creation:", error);
      alert("An error occurred");
    }

    //window.location.reload();
  };
  // Return the rendered JSX
  return (
    <div className="mainBody">
      <div className="title-container">
        <h1>Your Games</h1>
        <button className="create-game-button" onClick={handleCreate}>
          Create Game
        </button>
      </div>
      {
        // Conditional rendering: if still loading
        loading ? (
          <p style={{ display: "flex", justifyContent: "center" }}>
            Loading...
          </p>
        ) : !games ? (
          <p style={{ display: "flex", justifyContent: "center" }}>
            No games found.
          </p>
        ) : games.length === 0 ? (
          <p style={{ display: "flex", justifyContent: "center" }}>
            No games found.
          </p>
        ) : (
          // If games are present, render a list
          <ul className="games-list">
            {games.map((game, index) => (
              <li key={index} className="game-item">
                <img src={game.image} alt={game.title} className="game-image" />
                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  <p className="game-description">{game.description}</p>
                </div>

                <div className="delete-game">
                    <button className="delete-button"
                        onClick={() => {
                            if (readyForDeletion !== game.id) {
                                setReadyForDeletion(game.id);
                            } else {
                                setReadyForDeletion(undefined);
                            }
                        }}
                    >
                      <img height={"auto"} width={"20px"} src={"/trash.png"} alt={"User"}/>
                    </button>
                    <div className={"delete-confirm " + (readyForDeletion === game.id ? "" : "hidden")}>
                        <div>
                            Are you sure you want to delete this game permanently?
                        </div>
                        <div>
                            <button className="delete-confirm-button"
                                onClick={() => deleteGame(game) }>
                                Yes, Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>

                { (hosting || editing) && activeGame === game.id ? (
                <div className="game-status-and-links">
                    <div className="game-status">
                        <div>
                         Status:
                        </div>
                        <div>
                        { status }
                        </div>
                    </div>
                    { status === "Running" ? (
                    <div className="game-links">
                        <button 
                            onClick={() => handleOpenGame(game) }
                            >
                            Open { editing ? "Editor" : "Game" }
                        </button>
                        <button
                            onClick={() => handleCopyLink(game) }
                            >
                            Copy Link
                        </button>
                    </div>
                        ) : (
                    <div className="game-links">
                        <button className="greyed-out">
                            Open { editing ? "Editor" : "Game" }
                        </button>
                        <button className="greyed-out">
                            Copy Link
                        </button>
                    </div>
                        )}
                </div>
                ) : "" }
                <div className="game-buttons">
                    { editing || (activeGame && activeGame !== game.id) ? (
                          <button
                            className="play-button greyed-out"
                          >
                            Host
                          </button>
                        ) : (
                          <button
                            className="play-button" 
                            onClick={() => handleHost(game)}
                          >
                                { !hosting ?
                                    "Host" : "Stop Hosting"
                                }
                          </button>
                         )
                    }

                    { (hosting || ( activeGame && activeGame !== game.id)) ? (
                          <button
                            className="edit-button greyed-out"
                          >
                            Edit
                        </button>
                        ) : (
                          <button
                            className="edit-button" 
                            onClick={() => handleEdit(game)}
                          >
                            { !editing ? 
                                "Edit" : "Stop Editor"
                            }
                          </button>
                        ) 
                    }
                </div>
              </li>
            ))}
          </ul>
        )
      }
      {showPopup && (
        <div className="popup-overlay">
          <div className="createBody">
            <h2 style={{ display: "flex", justifyContent: "center" }}>
              Create New Game
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="gameTitle"
                placeholder="Game Title"
                style={{
                  width: "80%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <textarea
                placeholder="Game Description"
                name="gameDescription"
                style={{
                  width: "80%",
                  height: "100px",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add Game
                </button>
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ccc",
                    color: "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGames;
