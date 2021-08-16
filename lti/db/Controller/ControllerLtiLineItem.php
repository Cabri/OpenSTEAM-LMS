<?php

namespace Lti\Controller;

use Lti\Entity\LtiLineItem;
use Database\DataBaseManager;

class ControllerLtiLineItem extends Controller
{
    public function __construct($entityManager, $user)
    {
      parent::__construct($entityManager, $user);
      $this->actions = array(

        'get' => function($data) {
          return $this->entityManager->getRepository('Lti\Entity\LtiLineItem')
            ->find($data['id']);
        },

        'add' => function($data) {
          $ltiLineItem = new LtiLineItem(
            $data['id'],
            $data['scoreMaximum'],
            $data['label'],
            $data['tag'],
            $data['resourceId'],
            $data['resourceLinkId']
          );

          $this->entityManager->persist($ltiLineItem);
          $this->entityManager->flush();
          return $ltiLineItem;
        }
      );
    }
}
