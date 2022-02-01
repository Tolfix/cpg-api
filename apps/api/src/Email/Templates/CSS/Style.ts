export default `
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #fafafa;
    font-family: sans-serif; }
  
  h1, h1[class="es"] {
    margin: 0 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #EFEFEF;
    color: #353535; }
  
  h2, h3, h4,
  h2[class="es"], h3[class="es"], h4[class="es"] {
    margin: 20px 0;
    padding: 5px 0;
    border-bottom: 1px solid #EFEFEF;
    color: #353535; }
  
  p[class="es"] {
    text-align: justify; }
  
  div[class="container"] {
    background-color: #F4F4F4;
    padding: 10px;
    margin: 10px auto;
    max-width: 650px;
    width: auto;
    line-height: 20px; }
  
  
  div[class="clear"] {
    clear: both; }
  
  a[class="es"] {
    color: #1976D2;
    font-weight: bold;
    text-decoration: none; }
    a[class="es"]:active {
      color: #1976D2; }
    a[class="es"]:hover {
      color: #2196F3; }
  
  button[class="btn"],
  a[class="btn"],
  button[class="btn btn-small"],
  a[class="btn btn-small"] {
    border: 1px solid #1976D2;
    color: #1976D2;
    display: inline-block;
    padding: 10px 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer; }
    button[class="btn"]:link,
    a[class="btn"]:link,
    button[class="btn btn-small"]:link,
    a[class="btn btn-small"]:link {
      color: #1976D2; }
    button[class="btn"]:active,
    a[class="btn"]:active,
    button[class="btn btn-small"]:active,
    a[class="btn btn-small"]:active {
      color: #1976D2; }
    button[class="btn"]:hover,
    a[class="btn"]:hover,
    button[class="btn btn-small"]:hover,
    a[class="btn btn-small"]:hover {
      border: 1px solid #2196F3;
      color: #2196F3;
      cursor: pointer; }
  
  button[class="btn btn-default"],
  a[class="btn btn-default"],
  button[class="btn btn-default btn-small"],
  a[class="btn btn-default btn-small"] {
    border: none;
    background-color: #f2f2f2;
    color: #4E6694;
    display: inline-block;
    padding: 10px 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer; }
    button[class="btn btn-default"]:hover,
    a[class="btn btn-default"]:hover,
    button[class="btn btn-default btn-small"]:hover,
    a[class="btn btn-default btn-small"]:hover {
      background-color: #E8E8E8;
      color: #4E80E0; }
    button[class="btn btn-default"]:link,
    a[class="btn btn-default"]:link,
    button[class="btn btn-default btn-small"]:link,
    a[class="btn btn-default btn-small"]:link {
      border: none;
      background-color: #f2f2f2;
      color: #4E6694; }
    button[class="btn btn-default"]:active,
    a[class="btn btn-default"]:active,
    button[class="btn btn-default btn-small"]:active,
    a[class="btn btn-default btn-small"]:active {
      border: none;
      background-color: #f2f2f2;
      color: #4E6694; }
  
  button[class="btn btn-primary"],
  a[class="btn btn-primary"],
  button[class="btn btn-primary btn-small"],
  a[class="btn btn-primary btn-small"] {
    border: none;
    background-color: #1976D2;
    color: #FFF;
    display: inline-block;
    padding: 10px 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer; }
    button[class="btn btn-primary"]:hover,
    a[class="btn btn-primary"]:hover,
    button[class="btn btn-primary btn-small"]:hover,
    a[class="btn btn-primary btn-small"]:hover {
      background-color: #2196F3;
      color: #FFF; }
    button[class="btn btn-primary"]:link,
    a[class="btn btn-primary"]:link,
    button[class="btn btn-primary btn-small"]:link,
    a[class="btn btn-primary btn-small"]:link {
      border: none;
      background-color: #1976D2;
      color: #FFF; }
    button[class="btn btn-primary"]:active,
    a[class="btn btn-primary"]:active,
    button[class="btn btn-primary btn-small"]:active,
    a[class="btn btn-primary btn-small"]:active {
      border: none;
      background-color: #1976D2;
      color: #FFF; }
  
  button[class="btn btn-success"],
  a[class="btn btn-success"],
  button[class="btn btn-success btn-small"],
  a[class="btn btn-success btn-small"] {
    border: none;
    background-color: #388E3C;
    color: #FFF;
    display: inline-block;
    padding: 10px 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer; }
    button[class="btn btn-success"]:hover,
    a[class="btn btn-success"]:hover,
    button[class="btn btn-success btn-small"]:hover,
    a[class="btn btn-success btn-small"]:hover {
      background-color: #4CAF50;
      color: #FFF; }
    button[class="btn btn-success"]:link,
    a[class="btn btn-success"]:link,
    button[class="btn btn-success btn-small"]:link,
    a[class="btn btn-success btn-small"]:link {
      border: none;
      background-color: #388E3C;
      color: #FFF; }
    button[class="btn btn-success"]:active,
    a[class="btn btn-success"]:active,
    button[class="btn btn-success btn-small"]:active,
    a[class="btn btn-success btn-small"]:active {
      border: none;
      background-color: #388E3C;
      color: #FFF; }
  
  button[class="btn btn-danger"],
  a[class="btn btn-danger"],
  button[class="btn btn-danger btn-small"],
  a[class="btn btn-danger btn-small"] {
    border: none;
    background-color: #D32F2F;
    color: #FFF;
    display: inline-block;
    padding: 10px 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer; }
    button[class="btn btn-danger"]:hover,
    a[class="btn btn-danger"]:hover,
    button[class="btn btn-danger btn-small"]:hover,
    a[class="btn btn-danger btn-small"]:hover {
      background-color: #F44336;
      color: #FFF; }
    button[class="btn btn-danger"]:link,
    a[class="btn btn-danger"]:link,
    button[class="btn btn-danger btn-small"]:link,
    a[class="btn btn-danger btn-small"]:link {
      border: none;
      background-color: #D32F2F;
      color: #FFF; }
    button[class="btn btn-danger"]:active,
    a[class="btn btn-danger"]:active,
    button[class="btn btn-danger btn-small"]:active,
    a[class="btn btn-danger btn-small"]:active {
      border: none;
      background-color: #D32F2F;
      color: #FFF; }
  
  button[class="btn btn-warning"],
  a[class="btn btn-warning"],
  button[class="btn btn-warning btn-small"],
  a[class="btn btn-warning btn-small"] {
    border: none;
    background-color: #FFA000;
    color: #FFF;
    display: inline-block;
    padding: 10px 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer; }
    button[class="btn btn-warning"]:hover,
    a[class="btn btn-warning"]:hover,
    button[class="btn btn-warning btn-small"]:hover,
    a[class="btn btn-warning btn-small"]:hover {
      background-color: #FFC107;
      color: #FFF; }
    button[class="btn btn-warning"]:link,
    a[class="btn btn-warning"]:link,
    button[class="btn btn-warning btn-small"]:link,
    a[class="btn btn-warning btn-small"]:link {
      border: none;
      background-color: #FFA000;
      color: #FFF; }
    button[class="btn btn-warning"]:active,
    a[class="btn btn-warning"]:active,
    button[class="btn btn-warning btn-small"]:active,
    a[class="btn btn-warning btn-small"]:active {
      border: none;
      background-color: #FFA000;
      color: #FFF; }
  
  button[class="btn btn-small"],
  a[class="btn btn-small"],
  button[class="btn btn-default btn-small"],
  a[class="btn btn-default btn-small"],
  button[class="btn btn-primary btn-small"],
  a[class="btn btn-primary btn-small"],
  button[class="btn btn-success btn-small"],
  a[class="btn btn-success btn-small"],
  button[class="btn btn-danger btn-small"],
  a[class="btn btn-danger btn-small"],
  button[class="btn btn-warning btn-small"],
  a[class="btn btn-warning btn-small"] {
    font-size: 12px;
    padding: 4px 5px; }
  
  p[class="text-muted"],
  span[class="text-muted"],
  div[class="text-muted"] {
    color: #999; }
  
  p[class="text-info"],
  span[class="text-info"],
  div[class="text-info"] {
    color: #03A9F4; }
    p[class="text-info"]:hover,
    span[class="text-info"]:hover,
    div[class="text-info"]:hover {
      color: #0288D1; }
  
  p[class="text-danger"],
  span[class="text-danger"],
  div[class="text-danger"] {
    color: #D32F2F; }
    p[class="text-danger"]:hover,
    span[class="text-danger"]:hover,
    div[class="text-danger"]:hover {
      color: #F44336; }
  
  p[class="text-center"],
  span[class="text-center"],
  div[class="text-center"] {
    text-align: center; }
  
  p[class="text-left"],
  span[class="text-left"],
  div[class="text-left"] {
    text-align: left; }
  
  p[class="text-right"],
  span[class="text-right"],
  div[class="text-right"] {
    text-align: right; }
  
  p[class="text-justify"],
  span[class="text-justify"],
  div[class="text-justify"] {
    text-align: justify; }
  
  div[class="row"] {
    overflow: hidden;
    width: 100%; }
  
  div[class="col-2"] {
    width: 13%;
    float: left;
    margin: 0 1.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-2"] {
        float: none; } }
  
  div[class="col-3"] {
    width: 22%;
    float: left;
    margin: 0 1.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-3"] {
        float: none; } }
  
  div[class="col-4"] {
    width: 30%;
    float: left;
    margin: 0 1.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-4"] {
        float: none; } }
  
  div[class="col-6"] {
    width: 47%;
    float: left;
    margin: 0 1.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-6"] {
        float: none; } }
  
  div[class="col-8"] {
    width: 63%;
    float: left;
    margin: 0 1.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-8"] {
        float: none; } }
  
  div[class="col-offset-2"],
  div[class="col-2 col-offset-2"],
  div[class="col-3 col-offset-2"],
  div[class="col-4 col-offset-2"],
  div[class="col-6 col-offset-2"],
  div[class="col-8 col-offset-2"] {
    margin-left: 17.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-offset-2"],
      div[class="col-2 col-offset-2"],
      div[class="col-3 col-offset-2"],
      div[class="col-4 col-offset-2"],
      div[class="col-6 col-offset-2"],
      div[class="col-8 col-offset-2"] {
        margin-left: 0; } }
  
  div[class="col-offset-3"],
  div[class="col-2 col-offset-3"],
  div[class="col-3 col-offset-3"],
  div[class="col-4 col-offset-3"],
  div[class="col-6 col-offset-3"],
  div[class="col-8 col-offset-3"] {
    margin-left: 26.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-offset-3"],
      div[class="col-2 col-offset-3"],
      div[class="col-3 col-offset-3"],
      div[class="col-4 col-offset-3"],
      div[class="col-6 col-offset-3"],
      div[class="col-8 col-offset-3"] {
        margin-left: 0; } }
  
  div[class="col-offset-4"],
  div[class="col-2 col-offset-4"],
  div[class="col-3 col-offset-4"],
  div[class="col-4 col-offset-4"],
  div[class="col-6 col-offset-4"],
  div[class="col-8 col-offset-4"] {
    margin-left: 34.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-offset-4"],
      div[class="col-2 col-offset-4"],
      div[class="col-3 col-offset-4"],
      div[class="col-4 col-offset-4"],
      div[class="col-6 col-offset-4"],
      div[class="col-8 col-offset-4"] {
        margin-left: 0; } }
  
  div[class="col-offset-6"],
  div[class="col-2 col-offset-6"],
  div[class="col-3 col-offset-6"],
  div[class="col-4 col-offset-6"],
  div[class="col-6 col-offset-6"] {
    margin-left: 51.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-offset-6"],
      div[class="col-2 col-offset-6"],
      div[class="col-3 col-offset-6"],
      div[class="col-4 col-offset-6"],
      div[class="col-6 col-offset-6"] {
        margin-left: 0; } }
  
  div[class="col-offset-7"],
  div[class="col-2 col-offset-7"],
  div[class="col-3 col-offset-7"],
  div[class="col-4 col-offset-7"] {
    margin-left: 76.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-offset-7"],
      div[class="col-2 col-offset-7"],
      div[class="col-3 col-offset-7"],
      div[class="col-4 col-offset-7"] {
        margin-left: 0; } }
  
  div[class="col-offset-8"],
  div[class="col-2 col-offset-8"],
  div[class="col-3 col-offset-8"],
  div[class="col-4 col-offset-8"] {
    margin-left: 67.5%; }
    @media screen and (max-width: 425px) {
      div[class="col-offset-8"],
      div[class="col-2 col-offset-8"],
      div[class="col-3 col-offset-8"],
      div[class="col-4 col-offset-8"] {
        margin-left: 0; } }
  
  div[class="pull-left"],
  span[class="pull-left"] {
    float: left; }
  
  div[class="pull-right"],
  span[class="pull-right"] {
    float: right; }
  
  div[class="card"],
  div[class="card card-primary"],
  div[class="card card-success"],
  div[class="card card-danger"],
  div[class="card card-warning"],
  div[class="card card-info"] {
    padding: 15px;
    border: 1px solid #C3C3C3;
    margin-bottom: 20px; }
  
  div[class="card card-primary"] {
    background-color: #1976D2;
    border-color: #2196F3;
    color: #FFF; }
  
  div[class="card card-success"] {
    background-color: #388E3C;
    border-color: #4CAF50;
    color: #FFF; }
  
  div[class="card card-danger"] {
    background-color: #D32F2F;
    border-color: #F44336;
    color: #FFF; }
  
  div[class="card card-warning"] {
    background-color: #FFA000;
    border-color: #FFC107;
    color: #FFF; }
  
  div[class="card card-info"] {
    background-color: #03A9F4;
    border-color: #0288D1;
    color: #FFF; }
  
  code {
    background-color: #faebd7;
    color: #f00; }
  
  pre {
    background-color: #eee;
    padding: 5px;
    display: block; }
`