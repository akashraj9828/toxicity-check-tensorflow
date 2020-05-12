import React, { useState,useEffect, Fragment } from 'react';
import './style/index.scss';
import Footer from "./components/Footer"
import Header from "./components/Header"
const toxicity = require('@tensorflow-models/toxicity');

function App() {

  // let initial_text = "you're stupid!";
  let initial_text = "";
  let [model, setModel] = useState()
  let [text, setText] = useState(initial_text)
  // text for that prediction is being made
  let [predictionText, setPredictionText] = useState('')
  let [result, setResult] = useState('')
  let [processing, setProcessing] = useState(false)

  async function loadModel() {
    let model = await toxicity.load()
    setModel(model)
  }

  async function predict() {
    if (model) {
      setProcessing(true)
      let input = [text]
      let res = await model.classify(input)
      res.sort((a, b) => b?.results[0]?.probabilities['1'] - a?.results[0]?.probabilities['1'])
      let parsed_res = res.map(r => {
        let label = r?.label

        let probality = r?.results[0]?.probabilities
        let confidence_positive = (probality['1'] * 100).toPrecision(3)
        let confidence_negative = (probality['0'] * 100).toPrecision(3)

        let color = `rgba(${confidence_positive * 2.5},${confidence_negative * 2.5},100,0.7)`
        let style = { background: color }

        return <Fragment key={label}>
          <div className=" col-sm-6 my-1">
            <div style={style} className="rounded result-item">
              <span>
                {label}
              </span>
              <span>
                {confidence_positive}%
              </span>
            </div>
          </div>
        </Fragment>
      })
      setResult(parsed_res)
      setPredictionText(text)
      setProcessing(false)
    }
  }

  useEffect(() => {
    loadModel()
  }, [])

  // useEffect(() => {
  //   predict()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [model])

  return (

    <Fragment>
      <Header />
      <div className="App">
        <main>
          {!model ? "Loading model........." :
            <Fragment>
              {/* <input onChange={(evt) => { setText(evt.target.value) }} onKeyUp={(e) => {if (e.keyCode === 13)predict(); }} value={text} placeholder="Type something" /> */}
              <textarea rows={3} onChange={(evt) => { setText(evt.target.value) }} value={text} placeholder="Type something" > </textarea>
              <button className="btn" onClick={predict} disabled={processing} >{processing ? "Processing..." : "Check toxicity"}</button>
              <div className="container">
                <div className="row">
                  <h4>{predictionText}</h4>
                  {result}
                </div>
              </div>
            </Fragment>
          }
        </main>
      </div>
      <Footer />
    </Fragment>

  );
}

export default App;
