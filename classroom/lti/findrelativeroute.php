<?php

function findRelativeRoute() {
	$rootPath = '';
	$firstStep = true;
	do {
		$currentPathFiles = scandir(__DIR__ . $rootPath);
		$vendorFolder = in_array('vendor', $currentPathFiles);
		$envFile= in_array('.env', $currentPathFiles);
		if ($vendorFolder == false && $envFile == false) {
			if ($firstStep) {
				$rootPath .= '/../';
				$firstStep = false;
			} else {
				$rootPath .= '../';
			}
			
		}
	} while ($vendorFolder == false && $envFile == false);
	return __DIR__ . $rootPath;
}