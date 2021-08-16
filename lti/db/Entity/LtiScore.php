<?php

namespace Lti\Entity;

use Doctrine\ORM\Mapping as ORM;
use Utils\Exceptions\EntityDataIntegrityException;
use Utils\Exceptions\EntityOperatorException;
use Utils\JsonDeserializer;

/**
 * @ORM\Entity(repositoryClass="Lti\Repository\LtiScoreRepository")
 * @ORM\Table(name="lti_scores")
 */
class LtiScore implements \JsonSerializable, \Utils\JsonDeserializer
{

  /**
   * @ORM\Id
   * @ORM\GeneratedValue
   * @ORM\Column(type="integer")
   * @var integer
   */
  private $id;

  /**
   * @ORM\Column(name="score_given", type="integer", nullable=false)
   * @var integer
   */
  private $scoreGiven;

  /**
   * @ORM\Column(name="score_maximum", type="integer", nullable=false)
   * @var integer
   */
  private $scoreMaximum;

  /**
   * @ORM\Column(name="comment", type="string", length=255, nullable=false)
   * @var string
   */
  private $comment;

  /**
   * @ORM\Column(name="tag", type="string", length=255, nullable=false)
   * @var string
   */
  private $tag;

  /**
   * @ORM\Column(name="timestamp", type="string", length=255, nullable=false)
   * @var string
   */
  private $timestamp;

  /**
   * @ORM\Column(name="activity_progress", type="string", length=255, nullable=false)
   * @var string
   */
  private $activityProgress;

  /**
   * @ORM\Column(name="grading_progress", type="string", length=255, nullable=false)
   * @var string
   */
  private $gradingProgress;

  /**
   * @ORM\ManyToOne(targetEntity="Lti\Entity\LtiLineItem")
   * @ORM\JoinColumn(name="id_lineitem", referencedColumnName="id", onDelete="CASCADE")
   */
  private $lineitem;

  /**
   * LtiScore constructor.
   * @param int $id
   * @param int $scoreGiven
   * @param int $scoreMaximum
   * @param string $comment
   * @param string $tag
   * @param string $timestamp
   * @param string $activityProgress
   * @param string $gradingProgress
   * @param $lineitem
   */
  public function __construct(int $scoreGiven, int $scoreMaximum, string $comment, string $tag, string $timestamp, string $activityProgress, string $gradingProgress, $lineitem)
  {
    $this->scoreGiven = $scoreGiven;
    $this->scoreMaximum = $scoreMaximum;
    $this->comment = $comment;
    $this->tag = $tag;
    $this->timestamp = $timestamp;
    $this->activityProgress = $activityProgress;
    $this->gradingProgress = $gradingProgress;
    $this->lineitem = $lineitem;
  }

  /**
   * @return int
   */
  public function getId(): int
  {
    return $this->id;
  }

  /**
   * @param int $id
   */
  public function setId(int $id): void
  {
    $this->id = $id;
  }

  /**
   * @return int
   */
  public function getScoreGiven(): int
  {
    return $this->scoreGiven;
  }

  /**
   * @param int $scoreGiven
   */
  public function setScoreGiven(int $scoreGiven): void
  {
    $this->scoreGiven = $scoreGiven;
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
  public function getComment(): string
  {
    return $this->comment;
  }

  /**
   * @param string $comment
   */
  public function setComment(string $comment): void
  {
    $this->comment = $comment;
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
  public function getTimestamp(): string
  {
    return $this->timestamp;
  }

  /**
   * @param string $timestamp
   */
  public function setTimestamp(string $timestamp): void
  {
    $this->timestamp = $timestamp;
  }

  /**
   * @return string
   */
  public function getActivityProgress(): string
  {
    return $this->activityProgress;
  }

  /**
   * @param string $activityProgress
   */
  public function setActivityProgress(string $activityProgress): void
  {
    $this->activityProgress = $activityProgress;
  }

  /**
   * @return string
   */
  public function getGradingProgress(): string
  {
    return $this->gradingProgress;
  }

  /**
   * @param string $gradingProgress
   */
  public function setGradingProgress(string $gradingProgress): void
  {
    $this->gradingProgress = $gradingProgress;
  }

  /**
   * @return mixed
   */
  public function getLineitem()
  {
    return $this->lineitem;
  }

  /**
   * @param mixed $lineitem
   */
  public function setLineitem($lineitem): void
  {
    $this->lineitem = $lineitem;
  }


  public function jsonSerialize()
  {
    return [
      'id' => $this->getId(),
      'scoreGiven' => $this->getScoreGiven(),
      'scoreMaximum' => $this->getScoreMaximum(),
      'comment' => $this->getComment(),
      'tag' => $this->getTag(),
      'timestamp' => $this->getTimestamp(),
      'activityProgress' => $this->getActivityProgress(),
      'gradingProgress' => $this->getGradingProgress(),
      'lineitem' => $this->getLineitem()
    ];
  }

  public static function jsonDeserialize($jsonDecoded)
  {
    $ltiScoreInstance = new self();
    foreach ($jsonDecoded as $attributeName => $attributeValue) {
      $ltiScoreInstance->{$attributeName} = $attributeValue;
    }
    return $ltiScoreInstance;
  }


}
