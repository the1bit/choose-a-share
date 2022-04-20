import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import * as XLSX from 'xlsx';



function App() {

  const [items, setItems] = useState([]);
  const [optimalChanges, updateOptimalChanges] = useState(10);
  const [minimumAges, updateMinimumAges] = useState(5);





  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wslist = wb.SheetNames;
        let dataSet = [];
        wslist.forEach((currentSheet) => {
          const ws = wb.Sheets[currentSheet];
          const sheetData = XLSX.utils.sheet_to_json(ws);
          dataSet.push({
            sheetName: currentSheet,
            sheetData: sheetData
          });
        });

        resolve(dataSet);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };


    });

    promise.then((d) => {
      setItems(d);
    });
  };

  const renderShares = (dataSet) => {

    if (dataSet.length > 0) {
      let sheetData = dataSet[4].sheetData
      const headerRow = sheetData[1];
      return (
        <table class="table">
          <thead>
            <tr className='DataHeader'>
              <th scope="col">#</th>
              <th scope="col">{headerRow['All Members']}</th>
              <th scope="col">{headerRow.__EMPTY}</th>
              <th scope="col">{headerRow.__EMPTY_2}</th>
              <th scope="col">{headerRow.__EMPTY_3}</th>
              <th scope="col">{headerRow.__EMPTY_4}</th>

              <th className={'InportantColumn'} scope="col">{headerRow.__EMPTY_5}</th>
              <th scope="col">{headerRow.__EMPTY_10}</th>
              <th scope="col">{headerRow.__EMPTY_7}</th>
              <th scope="col">{headerRow.__EMPTY_9}</th>
              <th scope="col">Div increase %</th>
              <th className={'InportantColumn'} scope="col">Div increase % + DIV</th>
              <th scope="col">{headerRow.__EMPTY_11}</th>
              <th scope="col">{headerRow.__EMPTY_12}</th>
              <th scope="col">{headerRow.__EMPTY_15}</th>
              <th scope="col">{headerRow.__EMPTY_16}</th>
              <th scope="col">{headerRow.__EMPTY_17}</th>
              <th scope="col">{headerRow.__EMPTY_18}</th>
              <th scope="col">{headerRow.__EMPTY_19}</th>
              <th scope="col">{headerRow.__EMPTY_20}</th>
              <th scope="col">{headerRow.__EMPTY_8}</th>
              <th scope="col">{headerRow.__EMPTY_21}</th>
            </tr>
          </thead>


          <tbody>
            {
              sheetData.map((s, index) => (
                index > 1 && (parseInt(s.__EMPTY_3) >= minimumAges || minimumAges === 0) ? (
                  <tr key={index} className={`${getDataClassNames(s)}`}>
                    <th scope="row">{index - 1}</th>
                    <td>{s['All Members']}</td>
                    <td>{s.__EMPTY}</td>
                    <td>{s.__EMPTY_2}</td>
                    <td>{s.__EMPTY_3}</td>
                    <td>{s.__EMPTY_4}</td>
                    <td className={'InportantColumn'}>{s.__EMPTY_5}</td>
                    <td>{s.__EMPTY_10}</td>
                    <td>{s.__EMPTY_7}</td>
                    <td>{s.__EMPTY_9}</td>
                    <td>{((parseFloat(s.__EMPTY_9) / (parseFloat(s.__EMPTY_10) * parseInt(s.__EMPTY_8)) - 1) * 100).toFixed(3)}</td>
                    <td className={'InportantColumn'}>{(parseFloat(((parseFloat(s.__EMPTY_9) / (parseFloat(s.__EMPTY_10) * parseInt(s.__EMPTY_8)) - 1) * 100).toFixed(3)) + parseFloat(s.__EMPTY_5)).toFixed(3)}</td>
                    <td>{XLSX.SSF.format('yyyy-mm-dd', s.__EMPTY_11)}</td>
                    <td>{XLSX.SSF.format('yyyy-mm-dd', s.__EMPTY_12)}</td>
                    <td>{s.__EMPTY_15}</td>
                    <td>{s.__EMPTY_16}</td>
                    <td>{s.__EMPTY_17}</td>
                    <td>{s.__EMPTY_18}</td>
                    <td>{s.__EMPTY_19}</td>
                    <td>{s.__EMPTY_20}</td>
                    <td>{s.__EMPTY_8}</td>
                    <td>{s.__EMPTY_21}</td>
                  </tr>) : ('')

              ))}

          </tbody>
        </table>);
    }
  };

  const getDataClassNames = (s) => {
    let fairValueClass = (s.__EMPTY_21).split(' ').join('_');
    let optimalChangesClass = optimalChanges <= parseFloat(((parseFloat(s.__EMPTY_9) / (parseFloat(s.__EMPTY_10) * parseInt(s.__EMPTY_8)) - 1) * 100).toFixed(3)) + parseFloat(s.__EMPTY_5) ? 'Optimal' : '';
    if (optimalChangesClass !== '' && fairValueClass !== 'In_the_Margin_of_Safety') {
      return fairValueClass;
    }

    return `${fairValueClass} ${optimalChangesClass}`
  };


  const getFileUpdateDate = (dataSet) => {
    if (dataSet.length > 0) {
      return (<div className='DataUpdated'>File date: {items ? XLSX.SSF.format('yyyy-mm-dd', items[0].sheetData[4].__EMPTY) : ''}</div>)
    }
  };

  const itemsFilter = () => {
    let minimumAgesInput = parseInt(document.getElementById('minimum-ages-input').value);
    
    if (minimumAgesInput < 1 || minimumAgesInput > 99) {
      document.getElementById('minimum-ages-input').value = 5;
    }

    updateMinimumAges(parseInt(document.getElementById('minimum-ages-input').value));
    updateOptimalChanges(parseFloat(document.getElementById('optimal-changes-input').value));
  }

  return (
    <div className='App'>
      <h1 className='Header'>
        Choose-a-Share
      </h1>
      <div>{getFileUpdateDate(items)}</div>
      <input type={'file'} onChange={(e) => {
        const file = e.target.files[0];
        readExcel(file);
      }} ></input>
      <hr></hr>
      <div>
        <label>Optimal DIV changes (%): </label>&nbsp;
        <input id='optimal-changes-input' type={'number'} onChange={() => itemsFilter()} min={0.5} max={99.9}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        <label>Minimum ages (Year): </label>&nbsp;
        <input id='minimum-ages-input' type={'number'} onChange={() => itemsFilter()} min={5} max={100} step={1}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        <button type={'button'}>Reset Filter</button>
      </div>
      <hr></hr>

      <div>{
        renderShares(items)}</div>
    </div>
  );
}

export default App;
