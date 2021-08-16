<?php

namespace Lti\Entity;

use Doctrine\ORM\Mapping as ORM;
use Utils\Exceptions\EntityDataIntegrityException;
use Utils\Exceptions\EntityOperatorException;
use Utils\JsonDeserializer;

/**
 * @ORM\Entity(repositoryClass="Lti\Repository\LineItemRepository")
 * @ORM\Table(name="lti_lineitems")
 */
class LtiLineItem implements \JsonSerializable, \Utils\JsonDeserializer
{
//
  /**
   * @ORM\Id
   * @ORM\Column(type="string")
   * @var string
   */
  private $id;

  /**
   * @ORM\Column(name="score_maximum", type="integer", nullable=false)
   * @var integer
   */
  private $scoreMaximum;

  /**
   * @ORM\Column(name="label", type="string", length=255, nullable=false)
   * @var string
   */
  private $label;

  /**
   * @ORM\Column(name="tag", type="string", length=255, nullable=false)
   * @var string
   */
  private $tag;

  /**
   * @ORM\Column(name="resource_id", type="string", length=255, nullable=false)
   * @var string
   */
  private $resourceId;

  /**
   * @ORM\Column(name="resource_link_id", type="string", length=255, nullable=false)
   * @var string
   */
  private $resourceLinkId;

  /**
   * LtiLineItem constructor.
   * @param string $id
   * @param int $scoreMaximum
   * @param string $label
   * @param string $tag
   * @param string $resourceId
   * @param string $resourceLinkId
   */
  public function __construct(string $id, int $scoreMaximum, string $label, string $tag, string $resourceId, string $resourceLinkId)
  {
    $this->id = $id;
    $this->scoreMaximum = $scoreMaximum;
    $this->label = $label;
    $this->tag = $tag;
    $this->resourceId = $resourceId;
    $this->resourceLinkId = $resourceLinkId;
  }



  /**
   * @return string
   */
  public function getId(): string
  {
    return $this->id;
  }

  /**
   * @param string $id
   */
  public function setId(string $id): void
  {
    $this->id = $id;
  }

  /**
   * @return int
   */
  public function getScoreMaximum(): int
  {
    return $this->scoreMaximum;
  }

  /**
   * @param int $scoreMaximum
   */
  public function setScoreMaximum(int $scoreMaximum): void
  {
    $this->scoreMaximum = $scoreMaximum;
  }

  /**
   * @return string
   */
  public function getLabel(): string
  {
    return $this->label;
  }

  /**
   * @param string $label
   */
  public function setLabel(string $label): void
  {
    $this->label = $label;
  }

  /**
   * @return string
   */
  public function getTag(): string
  {
    return $this->tag;
  }

  /**
   * @param string $tag
   */
  public function setTag(string $tag): void
  {
    $this->tag = $tag;
  }

  /**
   * @return string
   */
  public function getResourceId(): string
  {
    return $this->resourceId;
  }

  /**
   * @param string $resourceId
   */
  public function setResourceId(string $resourceId): void
  {
    $this->resourceId = $resourceId;
  }

  /**
   * @return string
   */
  public function getResourceLinkId(): string
  {
    return $this->resourceLinkId;
  }

  /**
   * @param string $resourceLinkId
   */
  public function setResourceLinkId(string $resourceLinkId): void
  {
    $this->resourceLinkId = $resourceLinkId;
  }





  public static function jsonDeserialize($json)
  {
    // TODO: Implement jsonDeserialize() method.
  }

  public function jsonSerialize()
  {
    // TODO: Implement jsonSerialize() method.
  }
}
