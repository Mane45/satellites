import "./ListSatellite.css";
import { SatelliteData } from "../../configs/config";
import { twoline2satrec } from "satellite.js";
import { getSatelliteLocation } from "../../helpers/satelliteCoords";
import { loadModules } from "esri-loader";

function ListSatellite(props) {
  function dropDownSatellite() {
    document.querySelector(".list").classList.toggle("showList");
    document.querySelector(".down-arrow").classList.toggle("rotate180");
  }
  const handleItemClick = (e) => {
    
    props.setSelectedSatellite((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked
    }));
    if(!e.target.checked){
      // console.log(e.target.parentElement.children[2]);
      // console.log(e.target.checked);
      e.target.parentElement.children[2].children[1].checked = e.target.checked;
      e.target.parentElement.children[3].children[1].checked = e.target.checked;
      e.target.parentElement.children[4].children[1].checked = e.target.checked;
      
    }
  };
  const handelItemChange = (e) => {
    //console.log(e.target.parentElement.parentElement.children[0].checked);
    if (e.target.parentElement.parentElement.children[0].checked) {
      props.setSelectedSatellite1((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.checked
      }));
    } else {
      alert("Please choose te satelliet");
      e.target.checked = !e.target.checked;
    }

  }
  const handleItemClickAll = (e) => {
    //let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkboxes = document.getElementsByClassName('checkbox');
    //console.log(checkboxes);
    function checkedAll() {
      //let checkboxes = document.querySelectorAll('input[type="checkbox"]');
      //let checkboxes = document.getElementsByClassName('checkbox');
      //for (let checkbox of checkboxes) {
      //for (let i = 0; i < checkboxes.length; i++) {
      //checkbox.checked = "true";
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          checkboxes[i].checked = !!checkboxes[i].checked
          //props.map.removeAll()
        } else checkboxes[i].checked = !checkboxes[i].checked
      }
      //}
    }
    function removeCheckedAll() {
      //let checkboxes = document.querySelectorAll('input[type="checkbox"]');
      //let checkboxes = document.getElementsByClassName('checkbox');
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          checkboxes[i].checked = !checkboxes[i].checked
          //props.map.removeAll()
        } else checkboxes[i].checked = !!checkboxes[i].checked
      }
    }
    if (e.target.checked) {
      checkedAll()
    } else removeCheckedAll()

    for (let i = 0; i < checkboxes.length; i++) {
      //console.log(checkboxes[i]);
      props.setSelectedSatellite((prevState) => ({
        ...prevState,
        [checkboxes[i].name]: e.target.checked,
      }));
    }
  };
  const handleZoom = (e) => {
    //if (e.target.parentElement.parentElement.children[0].checked) {
    let name = e.target.parentElement.parentElement.children[1].textContent;
    if (e.target.parentElement.parentElement.children[0].checked) {
      if (e.target.checked) {
        //console.log(e.target.checked);
        SatelliteData.forEach((item) => {
          if (item.lines.name === name) {
            let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
            let loc = getSatelliteLocation(satrec, new Date());
            props.view.goTo({
              position: {
                x: loc.x,
                y: loc.y,
                z: loc.z * 2
              }
            })
          }

        });
      } else {
        props.view.goTo({
          zoom: 1
        },
          // {speedFactor: 0.1, easing: "out-guit"}
        );
      }

    } else {
      alert("Please choose te satelliet");
      e.target.checked = !e.target.checked;
    }
  };
  const handleTrack = (e) => {
    let name = e.target.parentElement.parentElement.children[1].textContent;
    //console.log(name)
    if (e.target.parentElement.parentElement.children[0].checked) {
      let trackFeatures = [];
      loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"]).then(([Graphic, GraphicsLayer]) => {
        const graphicLayer = new GraphicsLayer();
        SatelliteData.forEach((item) => {
          if (item.lines.name === name) {
            let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
            for (let i = 0; i < 60 * 24; i++) {
              let loc = null;
              try {
                loc = getSatelliteLocation(satrec, new Date(Date.now() + i * 1000 * 60));
              } catch (error) { }
              if (loc != null) {
                trackFeatures.push([loc.x, loc.y, loc.z])
              }
            }
          }
        })
        //console.log(trackFeatures);
        const track = new Graphic({
          geometry: {
            type: "polyline",
            paths: [trackFeatures]
          },
          symbol: {
            type: "line-3d",
            symbolLayers: [
              {
                type: "line",
                material: {
                  color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7]
                },
                size: 2
              }
            ]
          }
        });
        if (e.target.checked) {
          graphicLayer.graphics.add(track);
          props.map.add(graphicLayer);
        } else {
         props.map.layers.removeAll();
         //console.log(Object.values(document.getElementsByClassName("select-item")).slice(1))
         Object.values(document.getElementsByClassName("select-item")).slice(1).forEach(item => {
          if(item.children[3].children[1].checked){
            item.children[3].children[1].checked = !item.children[3].children[1].checked
          } else item.children[3].children[1].checked = !!item.children[3].children[1].checked
          // item.children[3].children[1].checked = "true";
          // console.log(item.children[3].children[1].checked)
         })
        }
        
      })
    } else {
      alert("Please choose te satelliet");
      //console.log(e.target.checked)
      e.target.checked = !e.target.checked;
    }
    

  }
  // const handleTracktest = (e) => {
  //   console.log(e.target.name);
  //   if (e.target.parentElement.parentElement.children[0].checked) {
  //     props.setSelectedSatellite2((prevState) => ({
  //       ...prevState,
  //       [e.target.name]: e.target.checked
  //     }));
  //   } else {
  //     alert("Please choose te satelliet");
  //     e.target.checked = !e.target.checked;
  //   }
  // }
  // const handleTrack = (e) => {
  //   let array = []
  //   let selectList = Object.values(document.getElementsByClassName("select-item")).slice(1);
  //   selectList.forEach(item => {
  //     array.push(item.children[3].children[1].checked);
  //   })
  //   let list = [];
  //   //trackListArray(list);
  //   //console.log(list);
  //   array.forEach((item, index) => {
  //     console.log(array[index])
  //     if (array[index]) {
  //     }
  //   })
  // }

  //   const handleTrack3 = (e) => {
  //     let array = [];
  //     let list = [];
  //     let tracks = [];
  //     let selectList = Object.values(document.getElementsByClassName("select-item")).slice(1);
  //     selectList.forEach(item => {
  //       array.push(item.children[3].children[1].checked);
  //     })
  //     let trackFeatures = [];
  //     loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"]).then(([Graphic, GraphicsLayer]) => {
  //       let tracksLayer = new GraphicsLayer();
  //       tracksLayer.removeAll()
  //       // console.log(tracksLayer.removeAll());
  //       // console.log(tracksLayer);

  //       SatelliteData.forEach((item) => {
  //         let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
  //         for (let i = 0; i < 60 * 24; i++) {
  //           let loc = null;
  //           try {
  //             loc = getSatelliteLocation(satrec, new Date(Date.now() + i * 1000 * 60));
  //           } catch (error) { }
  //           if (loc != null) {
  //             trackFeatures.push([loc.x, loc.y, loc.z])
  //           }
  //         }
  //         //console.log(trackFeatures)
  //         const track = new Graphic({
  //           geometry: {
  //             type: "polyline",
  //             paths: [trackFeatures]
  //           },
  //           symbol: {
  //             type: "line-3d",
  //             symbolLayers: [
  //               {
  //                 type: "line",
  //                 material: {
  //                   color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7]
  //                 },
  //                 size: 2
  //               }
  //             ]
  //           }
  //         })
  //         //console.log(track)
  //         list.push(track);
  //         //console.log(list)
  //         return list
  //       })
  //       //console.log(list)
  //       //x = list
  //       //return list;
  //       array.forEach((item, index) => {
  //         // console.log(array)
  //         if (array[index]) {
  //           console.log(array)
  //           console.log(list)
  //           //console.log(list[index])
  //           tracks.push(list[index]);
  //         }
  //       })
  //       //console.log(tracksLayer.GraphicsLayer.removeAll)
  //       //console.log(tracks)
  //       tracksLayer.addMany(tracks);
  //       console.log(tracksLayer);
  //       props.map.add(tracksLayer);

  //       // console.log(props.map.layers);
  //       // if(e.target.checked) {
  //       //   tracksLayer.addMany(tracks);
  //       //   props.map.add(tracksLayer);
  //       // } else {
  //       //   //tracksLayer.removeAll();
  //       //   //props.map.add(tracksLayer);
  //       //   props.map.layers.pop(tracksLayer);
  //       // }

  //     })
  //     //console.log(list)
  //   //}
  // }

  //let trackList = ['sdsf'];
  //let trackBtnList = [];
  // function trackListArray() {
  //   let trackBtnList = []
  //   loadModules(["esri/Graphic"]).then(([Graphic]) => {
  //     SatelliteData.forEach((item) => {
  //       let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
  //       for (let i = 0; i < 60 * 24; i++) {
  //         let loc = null;
  //         try {
  //           loc = getSatelliteLocation(satrec, new Date(Date.now() + i * 1000 * 60));
  //         } catch (error) { }
  //         if (loc != null) {
  //           trackFeatures.push([loc.x, loc.y, loc.z])
  //         }
  //       }
  //       track = new Graphic({
  //         geometry: {
  //           type: "polyline",
  //           paths: [trackFeatures]
  //         },
  //         symbol: {
  //           type: "line-3d",
  //           symbolLayers: [
  //             {
  //               type: "line",
  //               material: {
  //                 color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7]
  //               },
  //               size: 2
  //             }
  //           ]
  //         }
  //       })
  //       trackBtnList.push(track);
  //       return trackBtnList
  //     })
  //     console.log(trackBtnList)
  //   })
  // }
  //   const handleTrack2 = (e) => {
  //     let trackBtnList = [];
  //     let selectList = document.getElementsByClassName("select-item");
  //     //console.log(selectList);
  //     //console.log(Array.isArray(selectList));
  //     //console.log(SatelliteData);
  //     let trackFeatures = [];
  //     let track;
  //     loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"]).then(([Graphic, GraphicsLayer]) => {
  //       const trackLayer = new GraphicsLayer();
  //       SatelliteData.forEach((item) => {
  //         //console.log(item)
  //         let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
  //         for (let i = 0; i < 60 * 24; i++) {
  //           let loc = null;
  //           try {
  //             loc = getSatelliteLocation(satrec, new Date(Date.now() + i * 1000 * 60));
  //           } catch (error) { }
  //           if (loc != null) {
  //             trackFeatures.push([loc.x, loc.y, loc.z])
  //           }
  //         }
  //         //console.log(trackFeatures)
  //         track = new Graphic({
  //           geometry: {
  //             type: "polyline",
  //             paths: [trackFeatures]
  //           },
  //           symbol: {
  //             type: "line-3d",
  //             symbolLayers: [
  //               {
  //                 type: "line",
  //                 material: {
  //                   color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7]
  //                 },
  //                 size: 2
  //               }
  //             ]
  //           }
  //         })
  //         trackBtnList.push(track);
  //         return trackBtnList
  //       })
  //       //trackLayer.addMany(trackBtnList);
  //       //console.log(trackLayer);
  //       //props.map.add(trackLayer);
  //       let btns = Object.values(selectList).slice(1);
  //       let arr = [];
  //       //btns.forEach((item, index) => {
  //       for (let i = 0; i < btns.length; i++) {
  //         //console.log(item.children[3].children[1].checked)
  //         if (btns[i].children[3].children[1].checked) {
  //           // arr.push(trackBtnList[index]);
  //           // console.log(arr);
  //           trackLayer.removeAll();
  //           trackLayer.add(trackBtnList[i]);
  //           props.map.add(trackLayer);
  //           //props.view.graphics.add(trackBtnList[index])
  //         } else if (!btns[i].children[3].children[1].checked) { continue; }

  //           // console.log(arr);
  //           // arr.shift(trackBtnList[index])
  //           //console.log(item.children[3].children[1]);
  //           //console.log(trackBtnList[index])
  //           //trackLayer.removeAll();
  //           //let arr = [];
  //           //arr.push(trackBtnList[index]);
  //           //trackLayer.removeAll();
  //           //props.map.add(trackLayer);
  //         }
  //       //})

  //     // trackLayer.addMany(arr)
  //     // props.map.add(trackLayer);

  //     console.log(btns);
  //     return trackBtnList
  //   }).then(res => {
  //     console.log(res);
  //     //console.log(selectList);
  //     // let btns = Object.values(selectList).slice(1);
  //     // console.log(btns);
  //   }
  //   )
  // }

  // const handleTrack1 = (e) => {
  //   //console.log(e.target.parentElement.parentElement.children[0]);

  //   if (e.target.parentElement.parentElement.children[0].checked) {
  //     let name = e.target.parentElement.parentElement.children[1].textContent;
  //     let ar = [];
  //     loadModules(["esri/Graphic", "esri/layers/GraphicsLayer"]).then(([Graphic, GraphicsLayer]) => {
  //       //console.log(name);
  //       const trackLayer = new GraphicsLayer();
  //       let track;
  //       //console.log(name);
  //       // if (e.target.checked) {  
  //       //if (e.target.checked) {    
  //       let trackFeatures = [];
  //       //console.log(SatelliteData)
  //       SatelliteData.forEach((item) => {
  //         if (item.lines.name === name) {
  //           let satrec = twoline2satrec(item.lines.line1, item.lines.line2);
  //           for (let i = 0; i < 60 * 24; i++) {
  //             let loc = null;
  //             try {
  //               loc = getSatelliteLocation(satrec, new Date(Date.now() + i * 1000 * 60));
  //               //console.log(loc);
  //             } catch (error) { }
  //             if (loc != null) {
  //               trackFeatures.push([loc.x, loc.y, loc.z])
  //             }
  //           }
  //         }
  //         return trackFeatures
  //       });

  //       track = new Graphic({
  //         geometry: {
  //           type: "polyline",
  //           paths: [trackFeatures]
  //         },
  //         symbol: {
  //           type: "line-3d",
  //           symbolLayers: [
  //             {
  //               type: "line",
  //               material: {
  //                 color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7]
  //               },
  //               size: 2
  //             }
  //           ]
  //         }
  //       })
  //       console.log(track);
  //       trackList.push(track)
  //       console.log(trackList)
  //       //trackLayer.graphics.add(track);
  //       // props.map.addMany([trackLayer]);
  //       //console.log(trackLayer)
  //       //props.view.graphics.add(track);
  //       //ar.push({ name, track });
  //       if (e.target.checked) {
  //         //console.log(name);
  //         //console.log(trackLayer)
  //         props.view.graphics.add(track);
  //       } else {
  //         //track.geometry.paths = [];
  //         //console.log(e.target.checked);
  //         track.symbol.colors = [255, 255, 255, 0]
  //         //console.log(track.geometry.paths)
  //         props.view.graphics.removeAll();
  //       }


  //       //}
  //       //} else {
  //       //trackLayer.graphics.removeAll();
  //       //props.map.layers.items = props.map.layers.items.slice(0, 2)
  //       // props.map.remove(trackLayer);
  //       // console.log(props.map.layers.items);
  //       // console.log(props.map.layers.items.slice(0, 2));
  //       //   console.log(track);
  //       //   props.view.graphics.remove(track);
  //       // }
  //     })
  //   } else {
  //     alert("Please choose te satelliet");
  //     e.target.checked = !e.target.checked;
  //     //props.view.graphics.remove(track);
  //   }
  //   console.log(trackList)
  // }

  let renderedOutput = SatelliteData.map((item) => (
    <div className="select-item" key={item.id}>
      <input type="checkbox" className="checkbox" name={item.id} onClick={(e) => handleItemClick(e)} />
      <label>
        <p className="satName">{item.lines.name}</p>
      </label>
      {/* <button className="zoom" onClick={(e) => handleZoom(e)}>
        Zoom
      </button> */}
      <div className="toggle-button-wraper" onChange={(e) => handleZoom(e)}>
        <p className="btnName">Zoom</p>
        <input type="checkbox" className="toggle-button" name={item.id} />
      </div>
      {/* <button className="track" onClick={(e) => handleTrack(e)}>
        Track
      </button> */}
      <div className="toggle-button-wraper" onChange={(e) => handleTrack(e)}>
        <p className="btnName">Track</p>
        <input type="checkbox" className="toggle-button" name={item.id} />
      </div>
      {/* <button className="polygon" >
        Extent view
      </button> */}
      <div className="toggle-button-wraper" onChange={(e) => handelItemChange(e)}>
        <p className="btnName">Area</p>
        <input type="checkbox" className="toggle-button" name={item.id} />
      </div>
    </div>
  ));
  return (
    <div className="multi-selector">
      <div className="select-field" onClick={dropDownSatellite}>
        <input
          type="text"
          placeholder="Select Satellite"
          className="input-selector"
        />
        <span className="down-arrow">&#9660;</span>
      </div>
      <div className="list">
        <div className="select-item">
          <input type="checkbox" name="" onChange={handleItemClickAll}></input>
          <label>
            <p className="satName">Select All</p>
          </label>
        </div>
        {renderedOutput}
        {/* <RenderedOutput /> */}
      </div>
    </div>
  );
}
export default ListSatellite;
