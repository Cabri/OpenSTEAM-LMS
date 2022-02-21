<?php

require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';

use phpseclib\Crypt\RSA;
use Firebase\JWT\JWT;
use Classroom\Entity\LtiTool;

$ltiTools = $entityManager->getRepository(LtiTool::class)->findAll();

$privateKeysArr = [];
foreach($ltiTools as $ltiTool){
    $privateKeysArr[$ltiTool->getKid()] = $ltiTool->getPrivateKey();
}

function create_public_jwks($privateKeysArr) {
	$jwks = [];

	foreach ($privateKeysArr as $kid => $private_key) {
		$key = new RSA();
		$key->setHash("sha256");
		$key->loadKey($private_key);
		$key->setPublicKey(false, RSA::PUBLIC_FORMAT_PKCS8);
		if ( !$key->publicExponent ) {
			continue;
		}
		$components = array(
			'kty' => 'RSA',
			'alg' => 'RS256',
			'use' => 'sig',
			'e' => JWT::urlsafeB64Encode($key->publicExponent->toBytes()),
			'n' => JWT::urlsafeB64Encode($key->modulus->toBytes()),
			'kid' => $kid,
		);
		$jwks[] = $components;
	}
	echo json_encode(['keys' => $jwks]);
}

create_public_jwks($privateKeysArr);