<?php

namespace Lti\Controller;

use Lti\Entity\LtiScore;
use Database\DataBaseManager;

class ControllerLtiScore extends Controller
{
    public function __construct($entityManager, $user)
    {
      parent::__construct($entityManager, $user);
      $this->actions = array(

        'get' => function($data) {
          return $this->entityManager->getRepository('Lti\Entity\LtiScore')
            ->find($data['id']);
        },

        'add' => function($data) {
          $lineItem = $this->entityManager->getRepository('Lti\Entity\LtiLineItem')->find($data['lineItemId']);

          $ltiScore = new LtiScore(
            $data['scoreGiven'],
            $data['scoreMaximum'],
            $data['comment'],
            $data['tag'],
            $data['timestamp'],
            $data['activityProgress'],
            $data['gradingProgress'],
            $lineItem
          );

          $this->entityManager->persist($ltiScore);
          $this->entityManager->flush();
          return $ltiScore;
        }
      );
    }
}
