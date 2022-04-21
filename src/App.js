import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import icon from './mainicon.png'


function App() {

  const [items, setItems] = useState([]);
  const [optimalChanges, updateOptimalChanges] = useState(10);
  const [minimumAges, updateMinimumAges] = useState(10);
  const [minimumInitDiv, updateMinimumInitDiv] = useState(2);
  const [maximumInitDiv, updateMaximumInitDiv] = useState(7);
  const [sortParam, setSortParam] = useState(['All Members', 'asc']);




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
      // Main Data Sort
      const mainData = sheetData.slice(2);
      // Asc
      if (sortParam[1] === 'asc') {
        mainData.sort((a, b) => a[sortParam[0]] > b[sortParam[0]] ? 1 : -1);
      } else {
        mainData.sort((a, b) => a[sortParam[0]] < b[sortParam[0]] ? 1 : -1);
      }

      return (
        <div className='tableFixHead'>
          <table class="table">
            <thead>
              <tr className='DataHeader'>
                <th>#</th>
                <th>{headerRow['All Members']}</th>
                <th>{headerRow.__EMPTY}</th>
                <th>{headerRow.__EMPTY_2}</th>
                <th>{headerRow.__EMPTY_3}</th>
                <th>{headerRow.__EMPTY_4}</th>

                <th className={'InportantColumn'}>{headerRow.__EMPTY_5} %</th>
                <th>{headerRow.__EMPTY_10}</th>
                <th>{headerRow.__EMPTY_7}</th>
                <th>{headerRow.__EMPTY_9}</th>
                <th>Div increase %</th>
                <th className={'InportantColumn'}>Div increase % + DIV</th>
                <th>{headerRow.__EMPTY_11}</th>
                <th>{headerRow.__EMPTY_12}</th>
                <th>{headerRow.__EMPTY_15}</th>
                <th>{headerRow.__EMPTY_16}</th>
                <th>{headerRow.__EMPTY_17}</th>
                <th>{headerRow.__EMPTY_18}</th>
                <th>{headerRow.__EMPTY_19}</th>
                <th>{headerRow.__EMPTY_20}</th>
                <th>{headerRow.__EMPTY_8}</th>
                <th>{headerRow.__EMPTY_21}</th>
              </tr>
            </thead>


            <tbody>
              {
                mainData.map((s, index) => (
                  index > 1 && (parseInt(s.__EMPTY_3) >= minimumAges || minimumAges === 0) && (parseFloat(s.__EMPTY_5) >= minimumInitDiv || minimumInitDiv === 0) && (parseFloat(s.__EMPTY_5) <= maximumInitDiv || maximumInitDiv === 0) ? (
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
                      <td>{(((parseFloat(s.__EMPTY_9) / (parseFloat(s.__EMPTY_10) * parseInt(s.__EMPTY_8))) - 1) * 100).toFixed(3)}</td>
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
          </table></div>);
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

    if (parseFloat(document.getElementById('minimum-init-div-input').value) >= parseFloat(document.getElementById('maximum-init-div-input').value)) {
      alert("")
      document.getElementById('minimum-init-div-input').value = parseFloat(document.getElementById('maximum-init-div-input').value - 1).toFixed(2);
    }

    updateMinimumAges(parseInt(document.getElementById('minimum-ages-input').value));
    updateOptimalChanges(parseFloat(document.getElementById('optimal-changes-input').value));
    updateMinimumInitDiv(parseFloat(document.getElementById('minimum-init-div-input').value));
    updateMaximumInitDiv(parseFloat(document.getElementById('maximum-init-div-input').value));
  }

  const itemsSort = (input) => {
    let tempSortParam = ['All Members', 'asc'];
    switch (input) {
      case 'abc_asc':
        tempSortParam = ['All Members', 'asc'];
        break;
      case 'abc_desc':
        tempSortParam = ['All Members', 'desc'];
        break;
      case 'year_asc':
        tempSortParam = ['__EMPTY_3', 'asc'];
        break;
      case 'year_desc':
        tempSortParam = ['__EMPTY_3', 'desc'];
        break;
      case 'divyield_asc':
        tempSortParam = ['__EMPTY_5', 'asc'];
        break;
      case 'divyield_desc':
        tempSortParam = ['__EMPTY_5', 'desc'];
        break;
      case 'paydate_asc':
        tempSortParam = ['__EMPTY_12', 'asc'];
        break;
      case 'paydate_desc':
        tempSortParam = ['__EMPTY_12', 'desc'];
        break;
      default:
        tempSortParam = ['All Members', 'asc']
        break;

    }
    setSortParam(tempSortParam);


  }

  const resetFilters = () => {
    document.getElementById('minimum-ages-input').value = 10;
    document.getElementById('optimal-changes-input').value = 10;
    document.getElementById('minimum-init-div-input').value = 2;
    document.getElementById('maximum-init-div-input').value = 7;
    updateMinimumAges(parseInt(document.getElementById('minimum-ages-input').value));
    updateOptimalChanges(parseFloat(document.getElementById('optimal-changes-input').value));
    updateMinimumInitDiv(parseFloat(document.getElementById('minimum-init-div-input').value));
    updateMaximumInitDiv(parseFloat(document.getElementById('maximum-init-div-input').value));

    document.getElementById('sort-data-select').value = 'abc_asc';
    setSortParam(['All Members', 'asc']);
  }

  return (
    <div className='App'>
      <div className='Header'>
        <img className='mainIcon' src={icon} alt="Logo" />
        <h2>Choose-a-Share</h2>
        <label className='versionNumber'>(Version: 20220421)</label>
        <div className='legalInformation'>
          <label>Copyright {new Date().getFullYear()}, <a href='https://cloudsteak.com' target='_blank'>CloudSteak</a></label><br></br>
          <label><a href='https://github.com/the1bit/choose-a-share' target='_blank'>Source code on Github</a></label>
        </div>
      </div>
      <div>{getFileUpdateDate(items)}</div>
      <input className='fileChooser' type={'file'} onChange={(e) => {
        const file = e.target.files[0];
        readExcel(file);
      }} ></input>
      <hr></hr>
      <div>
        <label><i class="fas fa-highlighter"></i>&nbsp;&nbsp;Optimal DIV Changes (%): </label>&nbsp;
        <input id='optimal-changes-input' type={'number'} onChange={() => itemsFilter()} min={0.5} max={99.9} defaultValue={10}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        |&nbsp;&nbsp;&nbsp;&nbsp;
        <label><i class="fas fa-filter"></i>&nbsp;&nbsp;Min. Initial DIV (%): </label>&nbsp;
        <input id='minimum-init-div-input' type={'number'} onChange={() => itemsFilter()} min={0.1} step={0.1} max={99.9} defaultValue={2}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        <label>Max. Initial DIV (%): </label>&nbsp;
        <input id='maximum-init-div-input' type={'number'} onChange={() => itemsFilter()} min={1.5} step={0.1} max={99.9} defaultValue={7}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        <label>Minimum Ages (Year): </label>&nbsp;
        <input id='minimum-ages-input' type={'number'} onChange={() => itemsFilter()} min={5} max={100} step={1} defaultValue={10}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        |&nbsp;&nbsp;&nbsp;&nbsp;
        <label><i class="fas fa-sort-amount-down-alt"></i> Sort by: </label>&nbsp;
        <select id='sort-data-select' onChange={(e) => itemsSort(e.target.value)}>
          <option value={'abc_asc'}>Alphabetic (Asc) </option>
          <option value={'abc_desc'}>Alphabetic (Desc)</option>
          <option value={'year_asc'}>Years (Asc)</option>
          <option value={'year_desc'}>Years (Desc)</option>
          <option value={'divyield_asc'}>Div Yield (Asc)</option>
          <option value={'divyield_desc'}>Div Yield (Desc)</option>
          <option value={'paydate_asc'}>Pay Date (Asc)</option>
          <option value={'paydate_desc'}>Pay Date (Desc)</option>
        </select>&nbsp;&nbsp;&nbsp;&nbsp;
        |&nbsp;&nbsp;&nbsp;&nbsp;
        <button type={'button'} onClick={() => resetFilters()}><i class="fas fa-sync"></i> Reset Filter & Sort</button>
      </div>
      <hr></hr>

      <div>{
        renderShares(items)}</div>
    </div>
  );
}

export default App;
