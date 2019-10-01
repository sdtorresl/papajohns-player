<?php

function getMp3StreamTitle($streamingUrl, $interval, $offset = 0, $headers = true) {
  $needle = 'StreamTitle=';
  $ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36';

  $opts = array('http' => array(
    'method' => 'GET',
    'header' => 'Icy-MetaData: 1',
    'user_agent' => $ua
  )
  );

  if (($headers = get_headers($streamingUrl)))
    foreach ($headers as $h) {
      $currentSection = explode(':', $h);
      if (strpos(strtolower($h), 'icy-metaint') !== false && ($interval = $currentSection[1]))
        break;
    }

  $context = stream_context_create($opts);

  if ($stream = fopen($streamingUrl, 'r', false, $context)) {
    $buffer = stream_get_contents($stream, $interval, $offset);
    fclose($stream);

    if (strpos($buffer, $needle) !== false) {
      $currentSectionTwo = explode($needle, $buffer);
      $title = $currentSectionTwo[1];
      return substr($title, 1, strpos($title, ';') - 2);
    }
    else
      return getMp3StreamTitle($streamingUrl, $interval, $offset + $interval, false);
  }
  else
    throw new Exception("Unable to open stream [{$streamingUrl}]");
}

function getArtist() {
  $header = getMp3StreamTitle('https://streams.exeamedia.com/papa', 19200);
  $tags = explode(" - ", $header);
  return $tags[0];
}

function getTitle() {
  $header = getMp3StreamTitle('https://streams.exeamedia.com/papa', 19200);
  $tags = explode(" - ", $header);
  return $tags[1];
}

function getTags() {
  $header = getMp3StreamTitle('https://streams.exeamedia.com/papa', 19200);
  return json_encode(explode(" - ", $header));
}

$tag = $_REQUEST['tag'];

switch ($tag) {
  case 'artist':
    echo getArtist();
    break;
  case 'title':
    echo getArtist();
    break;
  case 'getTags':
    echo getTags();
    break;
  default:
    echo "No tags specified";
    break;
}

?>
