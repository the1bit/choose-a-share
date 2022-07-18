import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import icon from './mainicon.png'



function App() {

  const [items, setItems] = useState([]);
  const [optimalChanges, updateOptimalChanges] = useState(10);
  const [minimumAges, updateMinimumAges] = useState(10);
  const [minimumInitDiv, updateMinimumInitDiv] = useState(2.8);
  const [maximumInitDiv, updateMaximumInitDiv] = useState(7.8);
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
      
      const mainData = sheetData.slice(2);
      for (let d = 0; d < mainData.length; d++){
        const item = mainData[d];
        try {
          const divIncrease = ((parseFloat(item.__EMPTY_9) / (parseFloat(item.__EMPTY_10) * parseInt(item.__EMPTY_8)) - 1) * 100).toFixed(3);
          mainData[d].divIncrease = divIncrease;
        } catch (err) {
          mainData[d].divIncrease = "";
        }
        
        try {
          const divIncrease1Y = (parseFloat(item.__EMPTY_5) + parseFloat(item.__EMPTY_15)).toFixed(3);
          mainData[d].divIncrease1Y = divIncrease1Y;
        } catch (err) {
          mainData[d].divIncrease1Y = "";
        }

        try {
          const divIncrease5Y = (parseFloat(item.__EMPTY_5) + parseFloat(item.__EMPTY_17)).toFixed(3);
          mainData[d].divIncrease5Y = divIncrease5Y;
        } catch (err) {
          mainData[d].divIncrease5Y = "";
        }
      }
      // Main Data Sort
      // Asc
      if (sortParam[1] === 'asc') {
        if(sortParam[0] === 'divIncrease1Y' || sortParam[0] === 'divIncrease'){
          mainData.sort((a, b) => parseFloat(a[sortParam[0]]) > parseFloat(b[sortParam[0]]) ? 1 : -1);
        } else {
          mainData.sort((a, b) => a[sortParam[0]] > b[sortParam[0]] ? 1 : -1);
        }
      } else {
        if(sortParam[0] === 'divIncrease1Y' || sortParam[0] === 'divIncrease'){
          mainData.sort((a, b) => parseFloat(a[sortParam[0]]) < parseFloat(b[sortParam[0]]) ? 1 : -1);
        } else {  
          mainData.sort((a, b) => a[sortParam[0]] < b[sortParam[0]] ? 1 : -1);
      }
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
                <th className={'InportantColumn'}>Div increase %</th>
                <th className={'InportantColumn'}>Div increase (1Y GDR)</th>
                <th>Div increase (5Y DGR)</th>
                <th>{headerRow.__EMPTY_11}</th>
                <th>{headerRow.__EMPTY_12}</th>
                <th className={'InportantColumn'}>{headerRow.__EMPTY_15}</th>
                <th>{headerRow.__EMPTY_16}</th>
                <th>{headerRow.__EMPTY_17}</th>
                <th>{headerRow.__EMPTY_18}</th>
                <th>{headerRow.__EMPTY_19}</th>
                <th>{headerRow.__EMPTY_20}</th>
                <th>{headerRow.__EMPTY_8}</th>
                <th className={'InportantColumn'}>{headerRow.__EMPTY_22}</th>
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
                      <td className={'InportantColumn'}>{s.divIncrease}</td>
                      <td className={'InportantColumn'}>{s.divIncrease1Y}</td>
                      <td>{s.divIncrease5Y}</td>
                      <td>{XLSX.SSF.format('yyyy-mm-dd', s.__EMPTY_11)}</td>
                      <td>{XLSX.SSF.format('yyyy-mm-dd', s.__EMPTY_12)}</td>
                      <td className={'InportantColumn'}>{s.__EMPTY_15}</td>
                      <td>{s.__EMPTY_16}</td>
                      <td>{s.__EMPTY_17}</td>
                      <td>{s.__EMPTY_18}</td>
                      <td>{s.__EMPTY_19}</td>
                      <td>{s.__EMPTY_20}</td>
                      <td>{s.__EMPTY_8}</td>
                      <td className={'InportantColumn'}>{s.__EMPTY_22}</td>
                      <td>{s.__EMPTY_21}</td>
                    </tr>) : ('')
                ))}
            </tbody>
          </table></div>);
    }
  };

  const getDataClassNames = (s) => {
    let fairValueClass = (s.__EMPTY_21).split(' ').join('_');
    //let optimalChangesClass = optimalChanges <= parseFloat(((parseFloat(s.__EMPTY_9) / (parseFloat(s.__EMPTY_10) * parseInt(s.__EMPTY_8)) - 1) * 100).toFixed(3)) + parseFloat(s.__EMPTY_5) ? 'Optimal' : '';
    let optimalChangesClass = optimalChanges <= parseFloat((parseFloat(s.__EMPTY_9) + parseFloat(s.__EMPTY_15)).toFixed(3)) ? 'Optimal' : '';
    
    
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
      case 'sector_asc':
        tempSortParam = ['__EMPTY_2', 'asc'];
        break;
      case 'sector_desc':
        tempSortParam = ['__EMPTY_2', 'desc'];
        break;
      case 'year_asc':
        tempSortParam = ['__EMPTY_3', 'asc'];
        break;
      case 'year_desc':
        tempSortParam = ['__EMPTY_3', 'desc'];
        break;
      case 'price_asc':
        tempSortParam = ['__EMPTY_4', 'asc'];
        break;
      case 'price_desc':
        tempSortParam = ['__EMPTY_4', 'desc'];
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
        case 'fv_asc':
        tempSortParam = ['__EMPTY_22', 'asc'];
        break;
      case 'fv_desc':
        tempSortParam = ['__EMPTY_22', 'desc'];
        break;
      case 'divincrease_asc':
        tempSortParam = ['divIncrease', 'asc'];
        break;
      case 'divincrease_desc':
        tempSortParam = ['divIncrease', 'desc'];
        break;
        case 'divrationalincrease_asc':
        tempSortParam = ['divIncrease1Y', 'asc'];
        break;
      case 'divrationalincrease_desc':
        tempSortParam = ['divIncrease1Y', 'desc'];
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
    document.getElementById('minimum-init-div-input').value = 2.8;
    document.getElementById('maximum-init-div-input').value = 7.8;
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
        <label className='versionNumber'>(Version: 20220718)</label>
        <div className='legalInformation'>
          <label>Copyright {new Date().getFullYear()}, <a href='https://cloudsteak.com' rel='noopener noreferrer' target='_blank'>CloudSteak</a></label>(
          <label><a href='https://github.com/the1bit/choose-a-share' rel='noopener noreferrer' target='_blank'>Source code on Github</a></label>)<br></br>
          <label><a href='https://www.multpl.com/s-p-500-dividend-yield' rel='noopener noreferrer' target='_blank'><strong>S&P 500 Info</strong></a></label><br></br>
          Usage:
          <ol>
            <li>Get the latest <strong>Dividend Radar</strong> xlsx <a href='https://www.portfolio-insight.com/dividend-radar' rel='noopener noreferrer' target='_blank'>here</a></li>
            <li>Upload with 'choose file' then filter the result</li>
          </ol>
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
        <input id='minimum-init-div-input' type={'number'} onChange={() => itemsFilter()} min={0.1} step={0.1} max={99.9} defaultValue={2.8}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        <label>Max. Initial DIV (%): </label>&nbsp;
        <input id='maximum-init-div-input' type={'number'} onChange={() => itemsFilter()} min={1.5} step={0.1} max={99.9} defaultValue={7.8}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        <label>Minimum Ages (Year): </label>&nbsp;
        <input id='minimum-ages-input' type={'number'} onChange={() => itemsFilter()} min={5} max={100} step={1} defaultValue={10}></input>&nbsp;&nbsp;&nbsp;&nbsp;
        |&nbsp;&nbsp;&nbsp;&nbsp;
        <label><i class="fas fa-sort-amount-down-alt"></i> Sort by: </label>&nbsp;
        <select id='sort-data-select' onChange={(e) => itemsSort(e.target.value)}>
          <option value={'abc_asc'}>Alphabetic (Asc) </option>
          <option value={'abc_desc'}>Alphabetic (Desc)</option>
          <option value={'sector_asc'}>Sector (Asc) </option>
          <option value={'sector_desc'}>Sector (Desc)</option>
          <option value={'year_asc'}>Years (Asc)</option>
          <option value={'year_desc'}>Years (Desc)</option>
          <option value={'price_asc'}>Price (Asc)</option>
          <option value={'price_desc'}>Price (Desc)</option>
          <option value={'divyield_asc'}>Div Yield (Asc)</option>
          <option value={'divyield_desc'}>Div Yield (Desc)</option>
          <option value={'divincrease_asc'}>Div Increase (Asc)</option>
          <option value={'divincrease_desc'}>Div Increase (Desc)</option>
          <option value={'divrationalincrease_asc'}>Div Ratonal Increase (Asc)</option>
          <option value={'divrationalincrease_desc'}>Div Rational Increase (Desc)</option>
          <option value={'paydate_asc'}>Pay Date (Asc)</option>
          <option value={'paydate_desc'}>Pay Date (Desc)</option>
          <option value={'fv_desc'}>Fair Value % (Asc)</option>
          <option value={'fv_asc'}>Fair Value % (Desc)</option>
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
