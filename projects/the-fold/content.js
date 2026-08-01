/*
============================================
CONTENT CONFIGURATION
============================================
JS translation of scenes_config.py + endings_config.py.

Only the scenes needed for the current demo path are filled in.
Any scene referenced by `next` that isn't a key in SCENES will be
caught gracefully by engine.js's executeScene() with a "not yet
ported" message, so this file can grow incrementally without
touching the engine.
*/

// ============================================
// SCENE DEFINITIONS
// ============================================

const SCENES = {

  insertion: {
    use_visit_count: false,
    content_files: {
      1: 'insertion/insertion_ch1.txt'
    },
    base_options: [
      {
        text: 'Initiate insertion sequence',
        flag: 'entered_fold',
        response_files: {
          1: 'insertion/proceed_normal_ch1.txt'
        },
        next: 'first_hour'
      }
    ],
    conditional_options: [
      {
        text: 'Hesitate (NEW)',
        condition: () => gameState.chapter >= 2,
        flag: 'hesitating',
        next: 'insertion_hesitate'
      },
      {
        text: 'Read the handbook first (NEW)',
        condition: () => gameState.chapter >= 2,
        flag: 'reading_handbook',
        next: 'insertion_handbook'
      },
      {
        text: 'Check the emergency eject system (NEW)',
        condition: () => gameState.chapter >= 3,
        flag: 'checking_eject',
        next: 'insertion_check_eject'
      },
      {
        text: 'Refuse to cross (NEW)',
        condition: () => gameState.chapter >= 4,
        flag: 'refused_crossing',
        permanent_flag: 'ever_refused',
        response: 'insertion/refuse_response.txt',
        next: 'ending' // Refused ending
      }
    ]
  },

  insertion_hesitate: {
    use_visit_count: false,
    content_files: {
      1: 'insertion/hesitate_main.txt'
    },
    base_options: [
      {
        text: 'Proceed with insertion',
        flag: 'hesitated',
        response: 'insertion/hesitate_proceed.txt',
        next: 'first_hour'
      },
      {
        text: 'Abort the crossing',
        flag: 'refused_crossing',
        response: 'insertion/hesitate_abort.txt',
        next: 'ending' // Refused ending
      }
    ],
    conditional_options: []
  },

  insertion_handbook: {
    use_visit_count: false,
    content_files: {
      1: 'insertion/handbook_main.txt'
    },
    base_options: [
      {
        text: 'Close the handbook and proceed',
        flag: 'read_handbook_section_7',
        permanent_flag: 'read_handbook_section_7',
        response: 'insertion/proceed_normal.txt', // NB: this file doesn't exist in the
                                                     // source project either - loadText's
                                                     // graceful [Missing content] fallback
                                                     // fires here, faithfully matching the
                                                     // original Python behavior
        next: 'first_hour'
      },
      {
        text: 'Keep reading',
        flag: 'reading_deeper',
        next: 'insertion_handbook_deep'
      }
    ],
    conditional_options: []
  },

  insertion_handbook_deep: {
    use_visit_count: false,
    content_files: {
      1: 'insertion/handbook_deep.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'knows_retention_rates',
        permanent_flag: 'knows_retention_rates',
        response: 'insertion/handbook_close.txt',
        next: 'first_hour'
      }
    ],
    conditional_options: []
  },

  insertion_check_eject: {
    use_visit_count: false,
    content_files: {
      1: 'insertion/check_eject_main.txt'
    },
    base_options: [
      {
        text: 'Leave it alone and proceed with crossing',
        flag: 'eject_ready',
        response: 'insertion/eject_leave.txt',
        next: 'first_hour'
      },
      {
        text: 'Disengage the safety (just in case)',
        flag: 'eject_safety_off',
        response: 'insertion/eject_disengage.txt',
        next: 'first_hour'
      },
      {
        text: 'Pull it now',
        flag: 'ejected_pre_crossing',
        permanent_flag: 'ejected_before',
        response: 'insertion/eject_pull.txt',
        next: 'ending' // Ejection ending
      }
    ],
    conditional_options: []
  },

  first_hour: {
    use_visit_count: false,
    content_files: {
      1: 'first_hour/main_ch1.txt'
    },
    base_options: [
      {
        text: 'Trust the instruments (ignore visual anomalies)',
        flag: 'trusted_instruments',
        permanent_flag: 'trusted_instruments_before',
        response: 'first_hour/trust_instruments.txt',
        next: 'instrument_path'
      },
      {
        text: 'Trust your instinct (ignore the instruments)',
        flag: 'trusted_instinct',
        permanent_flag: 'trusted_instinct_before',
        next: 'instinct_path'
      },
      {
        text: "Investigate the discrepancy (find out what's wrong)",
        flag: 'investigated_anomaly',
        permanent_flag: 'investigated_before',
        next: 'first_hour_investigate'
      }
    ],
    conditional_options: [
      {
        text: "This happened before... (use memory) (NEW)",
        condition: () => gameState.chapter >= 3 && gameState.endingsSeen.length >= 1,
        flag: 'using_memory',
        next: 'first_hour_use_memory'
      },
      {
        text: "Attempt emergency return anyway (you know it won't work) (NEW)",
        condition: () => hasFlag('knows_return_is_trap') && gameState.chapter >= 2,
        flag: 'attempted_return_knowing',
        response: 'first_hour/emergency_return_fail.txt',
        next: 'ending' // Regression ending
      },
      {
        text: 'Navigate by impossibility (NEW)',
        condition: () => gameState.chapter >= 6 && gameState.endingsSeen.length >= 3,
        flag: 'navigating_by_impossibility',
        permanent_flag: 'mastered_fold_navigation',
        response: 'first_hour/navigate_impossibility.txt',
        next: 'ending' // Navigation by Nightmare ending
      }
    ]
  },

  // ============================================
  // FIRST HOUR - INVESTIGATE
  // ============================================

  first_hour_investigate: {
    use_visit_count: false,
    content_files: {
      1: 'first_hour/investigate_ch1.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'detected_presence',
        response: 'first_hour/investigate_closing.txt',
        next: 'scene_presence'
      }
    ],
    conditional_options: []
  },

  // ============================================
  // FIRST HOUR - USE MEMORY
  // (unlocked chapter 3+ once at least one ending has been seen)
  // ============================================

  first_hour_use_memory: {
    use_visit_count: false,
    content_files: {
      1: 'first_hour/use_memory_ch3.txt',
      4: 'first_hour/use_memory_ch4-5.txt',
      6: 'first_hour/use_memory_ch6plus.txt'
    },
    base_options: [
      {
        text: 'Trust instruments (you know where this leads)',
        flag: 'trusted_instruments',
        permanent_flag: 'trusted_instruments_before',
        response: 'first_hour/trust_instruments.txt',
        next: 'instrument_path'
      },
      {
        text: 'Trust instinct (you know where this leads)',
        flag: 'trusted_instinct',
        permanent_flag: 'trusted_instinct_before',
        next: 'instinct_path'
      },
      {
        text: "Investigate anyway (you know what you'll find)",
        flag: 'investigated_anomaly',
        permanent_flag: 'investigated_before',
        next: 'first_hour_investigate'
      }
    ],
    conditional_options: [
      {
        text: 'Try something completely different (NEW)',
        condition: () => gameState.chapter >= 5,
        flag: 'navigating_by_knowledge',
        response: 'first_hour/something_different.txt',
        next: 'scene_understanding'
      },
      {
        text: 'Access the temporal network (NEW)',
        condition: () => hasFlag('achieved_temporal_coordination') && gameState.endingsSeen.length >= 4,
        flag: 'accessed_echo_chamber',
        next: 'scene_echo_chamber'
      }
    ]
  },

  instrument_path: {
    use_visit_count: false,
    content_files: {
      1: 'instrument_path/main_ch1.txt'
    },
    base_options: [
      {
        text: 'Keep eyes on instruments (maintain discipline)',
        flag: 'maintained_discipline',
        next: 'instrument_maintain'
      },
      {
        text: 'Glance at the viewport (just for a second)',
        flag: 'glanced_viewport',
        next: 'instrument_glance'
      }
    ],
    conditional_options: [
      {
        text: 'Check external cameras instead (compromise) (NEW)',
        condition: () => gameState.chapter >= 3,
        flag: 'checking_cameras',
        next: 'instrument_cameras'
      },
      {
        text: "Accept that something is out there (NEW)",
        condition: () => hasFlag('knows_presence_real'),
        flag: 'acknowledged_presence',
        permanent_flag: 'accepted_fold_reality',
        next: 'instrument_accept'
      }
    ]
  },

  instrument_maintain: {
    use_visit_count: false,
    content_files: {
      1: 'instrument_path/maintain_discipline.txt'
    },
    base_options: [
      {
        text: 'Ignore it (stay the course)',
        flag: 'ignored_presence_completely',
        response: 'instrument_path/ignore_scraping.txt',
        next: 'scene_forced_confrontation'
      },
      {
        text: 'Check external sensors',
        flag: 'checked_sensors',
        response: 'instrument_path/check_sensors.txt',
        next: 'instrument_cameras'
      },
      {
        text: 'Look at the viewport',
        flag: 'broke_discipline',
        next: 'instrument_glance'
      }
    ],
    conditional_options: [
      {
        text: 'Reach for the eject handle (NEW)',
        condition: () => hasFlag('ever_ejected'),
        flag: 'ejected_from_terror',
        response: 'instrument_path/eject_terror.txt',
        next: 'ending' // Ejection ending
      }
    ]
  },

  scene_forced_confrontation: {
    use_visit_count: true,
    content_files: {
      1: 'forced_confrontation/main_visit1.txt'
    },
    base_options: [
      {
        text: 'Turn around (face it)',
        flag: 'faced_presence',
        next: 'forced_confrontation_face'
      },
      {
        text: "Keep ignoring it (it's not real)",
        flag: 'continued_denial',
        next: 'forced_confrontation_denial'
      },
      {
        text: 'Attack whatever is there',
        flag: 'attacked_presence_desperately',
        next: 'forced_confrontation_attack'
      }
    ],
    conditional_options: [
      {
        text: "Fine. I'll accept it. (NEW)",
        condition: () => gameState.chapter >= 3,
        flag: 'finally_accepted_reality',
        permanent_flag: 'stopped_denying',
        next: 'forced_confrontation_acceptance'
      }
    ]
  },

  forced_confrontation_face: {
    use_visit_count: false,
    content_files: {
      1: 'forced_confrontation/face_main.txt'
    },
    base_options: [
      {
        text: 'Try to communicate',
        flag: 'attempted_communication_after_denial',
        next: 'scene_reflection'
      },
      {
        text: "This isn't happening",
        flag: 'broke_from_reality',
        next: 'ending' // Consumption ending
      }
    ],
    conditional_options: []
  },

  forced_confrontation_acceptance: {
    use_visit_count: false,
    content_files: {
      1: 'forced_confrontation/acceptance_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'accepted_after_denial',
        permanent_flag: 'learned_to_accept',
        next: 'scene_understanding'
      }
    ],
    conditional_options: []
  },

  forced_confrontation_denial: {
    use_visit_count: false,
    content_files: {
      1: 'forced_confrontation/denial_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'maintained_denial_to_end',
        next: 'ending'
      }
    ],
    conditional_options: []
  },

  forced_confrontation_attack: {
    use_visit_count: false,
    content_files: {
      1: 'forced_confrontation/attack_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'attacked_manifestation',
        next: 'ending'
      }
    ],
    conditional_options: []
  },

  // ============================================
  // INSTRUMENT PATH - GLANCE
  // (reached from instrument_path's "Glance at the viewport" and
  // instrument_maintain's "Look at the viewport")
  // ============================================

  instrument_glance: {
    use_visit_count: true,
    content_files: {
      1: 'instrument_path/glance_visit1.txt'
    },
    base_options: [
      {
        text: 'Return focus to instruments (try to maintain discipline)',
        flag: 'instruments_proven_false',
        response: 'instrument_path/return_instruments.txt',
        next: 'scene_forced_confrontation'
      },
      {
        text: 'Keep looking (you need to understand)',
        flag: 'abandoned_instruments',
        response: 'instrument_path/keep_looking.txt',
        next: 'scene_reflection' // not yet ported - engine will show fallback
      },
      {
        text: 'Prepare for emergency maneuvers',
        flag: 'attempted_evasion',
        response: 'instrument_path/emergency_maneuver.txt',
        next: 'scene_presence' // not yet ported - engine will show fallback
      }
    ],
    conditional_options: []
  },

  // ============================================
  // INSTINCT PATH
  // (reached from first_hour's "Trust your instinct" option)
  // ============================================

  instinct_path: {
    use_visit_count: false,
    content_files: {
      1: 'instinct_path/main_ch1.txt'
    },
    base_options: [
      {
        text: 'Open yourself to the sensation (embrace it)',
        flag: 'opened_to_fold',
        next: 'instinct_embrace'
      },
      {
        text: 'Maintain control (resist communion)',
        flag: 'resisted_communion',
        next: 'instinct_resist'
      }
    ],
    conditional_options: [
      {
        text: "Let it guide you (you've learned to trust it) (NEW)",
        condition: () => gameState.chapter >= 3 && hasFlag('trusted_instinct_before'),
        flag: 'guided_by_fold',
        next: 'instinct_guided'
      },
      {
        text: 'Commune willingly (you know what it wants) (NEW)',
        condition: () => gameState.chapter >= 5 && hasFlag('accepted_communion'),
        flag: 'willing_communion',
        permanent_flag: 'mastered_communion',
        next: 'instinct_communion'
      }
    ]
  },

  instinct_guided: {
    use_visit_count: false,
    content_files: {
      1: 'instinct_path/guided_main.txt'
    },
    base_options: [
      {
        text: 'Follow where it leads',
        flag: 'followed_guidance',
        permanent_flag: 'trusted_fold_guidance',
        response: 'instinct_path/follow_guidance.txt',
        next: 'ending' // Compromise ending
      }
    ],
    conditional_options: []
  },

  instinct_communion: {
    use_visit_count: false,
    content_files: {
      1: 'instinct_path/communion_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'achieved_communion',
        permanent_flag: 'mastered_fold_navigation',
        next: 'scene_echo_chamber'
      }
    ],
    conditional_options: []
  },

  instinct_embrace: {
    use_visit_count: true,
    content_files: {
      1: 'instinct_path/embrace_visit1.txt'
    },
    base_options: [
      {
        text: "Pull back (you've gone too far)",
        flag: 'pulled_back_from_fold',
        response: 'instinct_path/pull_back.txt',
        next: 'instinct_resist'
      },
      {
        text: 'Go deeper (let it in completely)',
        flag: 'merged_with_fold',
        permanent_flag: 'accepted_communion',
        response: 'instinct_path/go_deeper.txt',
        next: 'ending' // Dissolution ending
      }
    ],
    conditional_options: [
      {
        text: 'Find balance (navigate the boundary) (NEW)',
        condition: () => gameState.chapter >= 4,
        flag: 'found_balance',
        permanent_flag: 'learned_balance',
        response: 'instinct_path/find_balance.txt',
        next: 'ending' // Compromise ending
      }
    ]
  },

  instinct_resist: {
    use_visit_count: false,
    content_files: {
      1: 'instinct_path/resist_main.txt'
    },
    base_options: [
      {
        text: 'Return to instruments (you were wrong)',
        flag: 'returned_to_instruments',
        response: 'instinct_path/return_instruments.txt',
        next: 'instrument_path'
      },
      {
        text: 'Keep navigating by feel (but carefully)',
        flag: 'careful_navigation',
        response: 'instinct_path/careful_navigation.txt',
        next: 'ending' // Compromise ending
      },
      {
        text: "Abort the insertion (you can't handle this)",
        flag: 'aborted_from_terror',
        response: 'instinct_path/abort_terror.txt',
        next: 'ending' // Regression ending
      },
      {
        text: 'Force through with willpower',
        flag: 'forced_through',
        response: 'instinct_path/force_through.txt',
        next: 'ending' // Violent Emergence ending
      }
    ],
    conditional_options: []
  },

  // ============================================
  // INSTRUMENT PATH - CAMERAS
  // (reached from instrument_maintain's "Check external sensors"
  // and instrument_path's chapter 3+ camera option)
  // ============================================

  instrument_cameras: {
    use_visit_count: true,
    content_files: {
      1: 'instrument_path/cameras_visit1.txt'
    },
    base_options: [
      {
        text: 'Trust the instruments (cameras are malfunctioning)',
        flag: 'rejected_camera_evidence',
        response: 'instrument_path/trust_instruments_over_cameras.txt',
        next: 'instrument_maintain'
      },
      {
        text: 'Trust the cameras (instruments are compromised)',
        flag: 'abandoned_instruments',
        response: 'instrument_path/trust_cameras.txt',
        next: 'scene_reflection'
      }
    ],
    conditional_options: [
      {
        text: 'Accept both are true somehow (NEW)',
        condition: () => gameState.chapter >= 3,
        flag: 'understood_dual_truth',
        permanent_flag: 'grasps_fold_logic',
        response: 'instrument_path/dual_truth.txt',
        next: 'scene_understanding'
      }
    ]
  },

  // ============================================
  // INSTRUMENT PATH - ACCEPT
  // (unlocked on replay once knows_presence_real is set, i.e. after
  // seeing the Consumption ending at least once)
  // ============================================

  instrument_accept: {
    use_visit_count: false,
    content_files: {
      1: 'instrument_path/accept_presence.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'contacted_presence',
        permanent_flag: 'spoke_to_self',
        next: 'scene_reflection'
      }
    ],
    conditional_options: []
  },

  // ============================================
  // THE PRESENCE
  // (reached from instrument_glance's "Prepare for emergency maneuvers"
  // and first_hour_investigate, once that's ported)
  // ============================================

  scene_presence: {
    use_visit_count: true,
    content_files: {
      1: 'presence/main_visit1.txt'
    },
    base_options: [
      {
        text: 'Try to communicate',
        flag: 'attempted_communication',
        next: 'presence_communicate'
      },
      {
        text: 'Prepare for evasive maneuvers',
        flag: 'attempted_evasion',
        response: 'presence/evasion_response.txt',
        next: 'ending' // Fragmentation ending
      },
      {
        text: 'Hold position and observe',
        flag: 'observed_presence',
        next: 'presence_observe'
      }
    ],
    conditional_options: [
      {
        text: "You're trying to help me (NEW)",
        condition: () => gameState.chapter >= 3 && hasFlag('knows_presence_real'),
        flag: 'recognized_presence',
        permanent_flag: 'understood_presence_nature',
        next: 'presence_recognition'
      },
      {
        text: 'Reach out willingly (NEW)',
        condition: () => gameState.chapter >= 5 && hasFlag('understood_presence_nature'),
        flag: 'willing_contact',
        next: 'presence_communion'
      }
    ]
  },

  presence_communicate: {
    use_visit_count: true,
    content_files: {
      1: 'presence/communicate_visit1.txt'
    },
    base_options: [
      {
        text: 'Ask who it is',
        flag: 'asked_identity',
        next: 'presence_identity'
      },
      {
        text: 'Ask what it wants',
        flag: 'asked_intention',
        next: 'presence_intention'
      },
      {
        text: 'Back away slowly',
        flag: 'retreated',
        response: 'presence/retreat_response.txt',
        next: 'ending' // Consumption ending
      }
    ],
    conditional_options: []
  },

  presence_observe: {
    use_visit_count: false,
    content_files: {
      1: 'presence/observe_main.txt'
    },
    base_options: [
      {
        text: 'Watch its movements',
        flag: 'studied_movement',
        next: 'presence_movement'
      },
      {
        text: 'Try scanning it',
        flag: 'scanned_presence',
        next: 'presence_scan'
      }
    ],
    conditional_options: []
  },

  presence_identity: {
    use_visit_count: false,
    content_files: {
      1: 'presence/identity_reveal.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'learned_identity',
        permanent_flag: 'knows_its_you',
        next: 'scene_reflection'
      }
    ],
    conditional_options: []
  },

  presence_intention: {
    use_visit_count: false,
    content_files: {
      1: 'presence/intention_reveal.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'learned_intention',
        permanent_flag: 'knows_trying_to_help',
        next: 'scene_understanding'
      }
    ],
    conditional_options: []
  },

  presence_movement: {
    use_visit_count: false,
    content_files: {
      1: 'presence/movement_analysis.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'understood_movement',
        permanent_flag: 'recognized_mirror_behavior',
        next: 'scene_reflection'
      }
    ],
    conditional_options: []
  },

  presence_scan: {
    use_visit_count: false,
    content_files: {
      1: 'presence/scan_results.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'scanned_self',
        permanent_flag: 'confirmed_its_you',
        next: 'scene_reflection'
      }
    ],
    conditional_options: []
  },

  presence_recognition: {
    use_visit_count: false,
    content_files: {
      1: 'presence/recognition_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'achieved_recognition',
        permanent_flag: 'spoke_to_self',
        next: 'scene_reflection'
      }
    ],
    conditional_options: []
  },

  presence_communion: {
    use_visit_count: false,
    content_files: {
      1: 'presence/communion_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'achieved_presence_communion',
        permanent_flag: 'mastered_presence_contact',
        next: 'scene_echo_chamber'
      }
    ],
    conditional_options: []
  },

  // ============================================
  // THE REFLECTION
  // (reached from instrument_glance's "Keep looking", instrument_cameras'
  // "Trust the cameras", instrument_accept, and three Presence sub-scenes)
  // ============================================

  scene_reflection: {
    use_visit_count: true,
    content_files: {
      1: 'reflection/main_visit1.txt'
    },
    base_options: [
      {
        text: 'Try to communicate',
        flag: 'attempted_reflection_communication',
        next: 'reflection_communicate'
      },
      {
        text: 'Attack immediately',
        flag: 'attacked_reflection',
        response: 'reflection/attack_response.txt',
        next: 'ending' // Fragmentation ending
      },
      {
        text: 'Back away slowly',
        flag: 'retreated_from_reflection',
        response: 'reflection/retreat_response.txt',
        next: 'ending' // Consumption ending
      }
    ],
    conditional_options: [
      {
        text: "You're me. From another crossing. (NEW)",
        condition: () => gameState.chapter >= 2 && hasFlag('knows_its_you'),
        flag: 'recognized_self',
        permanent_flag: 'accepted_temporal_self',
        next: 'reflection_recognition'
      },
      {
        text: 'Reach out (you understand now) (NEW)',
        condition: () => gameState.chapter >= 4 && hasFlag('accepted_temporal_self'),
        flag: 'reached_out_willingly',
        next: 'reflection_cooperation'
      }
    ]
  },

  reflection_recognition: {
    use_visit_count: false,
    content_files: {
      1: 'reflection/recognition_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'achieved_reflection_recognition',
        permanent_flag: 'spoke_with_temporal_self',
        next: 'scene_understanding'
      }
    ],
    conditional_options: []
  },

  reflection_cooperation: {
    use_visit_count: false,
    content_files: {
      1: 'reflection/cooperation_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'cooperated_with_self',
        permanent_flag: 'mastered_temporal_cooperation',
        next: 'scene_understanding'
      }
    ],
    conditional_options: []
  },

  reflection_communicate: {
    use_visit_count: true,
    content_files: {
      1: 'reflection/communicate_visit1.txt'
    },
    base_options: [
      {
        text: 'Ask what they want',
        flag: 'asked_reflection_intention',
        next: 'reflection_intention'
      },
      {
        text: 'Ask how this is possible',
        flag: 'asked_about_mechanism',
        next: 'reflection_explanation'
      },
      {
        text: 'This is a trick. Attack.',
        flag: 'attacked_after_communication',
        response: 'reflection/attack_after_talk.txt',
        next: 'ending' // Fragmentation ending
      }
    ],
    conditional_options: []
  },

  reflection_intention: {
    use_visit_count: false,
    content_files: {
      1: 'reflection/intention_reveal.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'learned_reflection_intention',
        permanent_flag: 'knows_selves_cooperate',
        next: 'scene_understanding'
      }
    ],
    conditional_options: []
  },

  reflection_explanation: {
    use_visit_count: false,
    content_files: {
      1: 'reflection/explanation_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'learned_temporal_mechanics',
        permanent_flag: 'understands_fold_time',
        next: 'scene_understanding'
      }
    ],
    conditional_options: []
  },

  // ============================================
  // UNDERSTANDING
  // (reached from Presence's "Ask what it wants", Reflection's
  // "Ask what they want" / "Ask how this is possible", and eventually
  // the chapter 3+ dual-truth camera option)
  // ============================================

  scene_understanding: {
    use_visit_count: true,
    content_files: {
      1: 'understanding/main_visit1.txt'
    },
    base_options: [
      {
        text: "Accept what you've learned",
        flag: 'accepted_truth',
        permanent_flag: 'understands_fold_nature',
        next: 'understanding_acceptance'
      },
      {
        text: "Reject this (it can't be true)",
        flag: 'rejected_truth',
        next: 'understanding_rejection'
      },
      {
        text: 'This changes everything',
        flag: 'transformed_by_truth',
        next: 'understanding_transformation'
      }
    ],
    conditional_options: [
      {
        text: 'Use this knowledge to navigate (NEW)',
        condition: () => gameState.chapter >= 5 && gameState.endingsSeen.length >= 3,
        flag: 'navigating_by_knowledge',
        permanent_flag: 'mastered_enlightened_navigation',
        next: 'understanding_mastery'
      }
    ]
  },

  understanding_acceptance: {
    use_visit_count: false,
    content_files: {
      1: 'understanding/acceptance_main.txt'
    },
    base_options: [
      {
        text: 'Work with your other selves',
        flag: 'achieved_cooperation',
        permanent_flag: 'mastered_temporal_cooperation',
        next: 'ending' // Emergence Protocol (if requirements met) or falls through
      },
      {
        text: 'Navigate alone but aware',
        flag: 'solo_enlightened_navigation',
        next: 'ending' // falls through to Violent Emergence default
      }
    ],
    conditional_options: []
  },

  understanding_rejection: {
    use_visit_count: false,
    content_files: {
      1: 'understanding/rejection_main.txt'
    },
    base_options: [
      {
        text: 'Force through despite knowing',
        flag: 'forced_through_despite_knowledge',
        next: 'ending' // falls through to Violent Emergence default
      },
      {
        text: 'Return to instruments (safer)',
        flag: 'retreated_from_truth',
        next: 'ending' // falls through to Violent Emergence default
      }
    ],
    conditional_options: []
  },

  understanding_transformation: {
    use_visit_count: false,
    content_files: {
      1: 'understanding/transformation_main.txt'
    },
    base_options: [
      {
        text: 'Embrace the change',
        flag: 'transformed_by_fold',
        permanent_flag: 'accepted_transformation',
        next: 'ending' // falls through to Violent Emergence default
      }
    ],
    conditional_options: []
  },

  understanding_mastery: {
    use_visit_count: false,
    content_files: {
      1: 'understanding/mastery_main.txt'
    },
    base_options: [
      {
        text: 'Navigate by enlightenment',
        flag: 'achieved_enlightened_navigation',
        permanent_flag: 'mastered_fold_truth',
        next: 'ending' // Emergence Protocol or Navigation by Nightmare
      },
      {
        text: 'Access the temporal network',
        flag: 'accessed_temporal_network',
        next: 'scene_echo_chamber'
      }
    ],
    conditional_options: []
  },

  // ============================================
  // ECHO CHAMBER
  // (reached from Understanding Mastery, First Hour Use Memory,
  // Instinct Communion, and Presence Communion)
  // ============================================

  scene_echo_chamber: {
    use_visit_count: true,
    content_files: {
      1: 'echo_chamber/main_visit1.txt',
      2: 'echo_chamber/main_visit2-3.txt',
      4: 'echo_chamber/main_visit4plus.txt'
    },
    base_options: [
      {
        text: 'Send a message backward (warn your past self)',
        flag: 'sent_warning_backward',
        next: 'echo_chamber_send'
      },
      {
        text: 'Listen for messages forward (receive guidance)',
        flag: 'listened_for_guidance',
        next: 'echo_chamber_receive'
      },
      {
        text: 'Connect to all iterations at once',
        flag: 'opened_full_network',
        next: 'echo_chamber_network'
      }
    ],
    conditional_options: [
      {
        text: 'Close the channel (too much information)',
        condition: () => gameState.chapter >= 3,
        flag: 'overwhelmed_by_echoes',
        next: 'echo_chamber_overwhelmed'
      },
      {
        text: 'Create a bootstrap loop (NEW)',
        condition: () => gameState.chapter >= 8 && gameState.endingsSeen.length >= 5,
        flag: 'created_bootstrap_loop',
        permanent_flag: 'mastered_temporal_communication',
        next: 'echo_chamber_bootstrap'
      }
    ]
  },

  echo_chamber_send: {
    use_visit_count: false,
    content_files: {
      1: 'echo_chamber/send_main.txt'
    },
    base_options: [
      {
        text: 'Warn about the danger',
        flag: 'sent_danger_warning',
        permanent_flag: 'helped_past_self',
        next: 'ending' // Compromise or Emergence Protocol
      },
      {
        text: 'Share navigation data',
        flag: 'shared_navigation_data',
        permanent_flag: 'improved_collective_knowledge',
        next: 'ending' // falls through to Violent Emergence default
      }
    ],
    conditional_options: []
  },

  echo_chamber_receive: {
    use_visit_count: false,
    content_files: {
      1: 'echo_chamber/receive_main.txt'
    },
    base_options: [
      {
        text: 'Follow the guidance',
        flag: 'followed_future_guidance',
        permanent_flag: 'received_temporal_help',
        next: 'ending' // Compromise ending
      },
      {
        text: 'Ignore it (trust yourself more)',
        flag: 'ignored_future_self',
        next: 'ending' // falls through to Violent Emergence default
      }
    ],
    conditional_options: []
  },

  echo_chamber_network: {
    use_visit_count: false,
    content_files: {
      1: 'echo_chamber/network_main.txt'
    },
    base_options: [
      {
        text: 'Coordinate all iterations',
        flag: 'coordinated_all_iterations',
        permanent_flag: 'achieved_temporal_coordination',
        next: 'ending' // Emergence Protocol
      },
      {
        text: 'Too much, pull back',
        flag: 'pulled_back_from_network',
        next: 'ending' // Compromise ending
      }
    ],
    conditional_options: []
  },

  echo_chamber_overwhelmed: {
    use_visit_count: false,
    content_files: {
      1: 'echo_chamber/overwhelmed_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'lost_in_echoes',
        next: 'ending' // Dissolution ending
      }
    ],
    conditional_options: []
  },

  echo_chamber_bootstrap: {
    use_visit_count: false,
    content_files: {
      1: 'echo_chamber/bootstrap_main.txt'
    },
    base_options: [
      {
        text: '[Continue]',
        flag: 'achieved_bootstrap_navigation',
        permanent_flag: 'mastered_causal_loops',
        next: 'ending' // Navigation by Nightmare ending
      }
    ],
    conditional_options: []
  }

};

// ============================================
// ENDING DEFINITIONS
// (full translation of endings_config.py - content files for endings
// not yet built will show "[Missing ending content]", same graceful
// fallback loadText already gives in the Python version)
// ============================================

const ENDINGS = {

  ending_refused: {
    tier: 'bad',
    name: 'REFUSED CROSSING',
    content_file: 'endings/refused.txt',
    condition: () => hasSessionFlag('refused_crossing'),
    unlocks: null
  },

  ending_ejection: {
    tier: 'bad',
    name: 'EJECTION',
    content_file: 'endings/ejection.txt',
    condition: () =>
      hasSessionFlag('ejected_pre_crossing') || hasSessionFlag('ejected_from_terror'),
    unlocks: 'ever_ejected'
  },

  ending_consumption: {
    tier: 'bad',
    name: 'CONSUMPTION',
    content_file: 'endings/consumption.txt',
    condition: () =>
      hasSessionFlag('ignored_presence_completely') ||
      hasSessionFlag('retreated_from_reflection') ||
      hasSessionFlag('retreated') ||
      hasSessionFlag('maintained_denial_to_end') ||
      hasSessionFlag('broke_from_reality'),
    unlocks: 'knows_presence_real'
  },

  ending_regression: {
    tier: 'bad',
    name: 'REGRESSION',
    content_file: 'endings/regression.txt',
    condition: () =>
      hasSessionFlag('aborted_from_terror') || hasSessionFlag('attempted_return_knowing'),
    unlocks: 'knows_return_is_trap'
  },

  ending_fragmentation: {
    tier: 'bad',
    name: 'FRAGMENTATION',
    content_file: 'endings/fragmentation.txt',
    condition: () =>
      hasSessionFlag('attempted_evasion') ||
      hasSessionFlag('attacked_reflection') ||
      hasSessionFlag('attacked_after_communication') ||
      hasSessionFlag('attacked_manifestation'),
    unlocks: 'attacked_self'
  },

  ending_dissolution: {
    tier: 'bad',
    name: 'DISSOLUTION',
    content_file: 'endings/dissolution.txt',
    condition: () =>
      hasSessionFlag('merged_with_fold') || hasSessionFlag('lost_in_echoes'),
    unlocks: 'dissolved_into_fold'
  },

  ending_violent_emergence: {
    tier: 'partial',
    name: 'VIOLENT EMERGENCE',
    content_file: 'endings/violent_emergence.txt',
    condition: () =>
      (hasSessionFlag('maintained_discipline') ||
        hasSessionFlag('forced_through') ||
        hasSessionFlag('forced_confrontation')) &&
      !hasSessionFlag('ignored_presence_completely') &&
      !hasSessionFlag('retreated_from_reflection') &&
      !hasSessionFlag('retreated'),
    unlocks: 'survived_through_violence'
  },

  ending_compromise: {
    tier: 'partial',
    name: 'COMPROMISE',
    content_file: 'endings/compromise.txt',
    condition: () =>
      hasSessionFlag('found_balance') ||
      hasSessionFlag('guided_by_fold') ||
      hasSessionFlag('careful_navigation') ||
      hasSessionFlag('followed_guidance') ||
      hasSessionFlag('sent_danger_warning') ||
      hasSessionFlag('followed_future_guidance') ||
      hasSessionFlag('pulled_back_from_network'),
    unlocks: 'accepted_change'
  },

  ending_navigation_by_nightmare: {
    tier: 'true',
    name: 'NAVIGATION BY NIGHTMARE',
    content_file: 'endings/navigation_by_nightmare.txt',
    condition: () =>
      (gameState.chapter >= 6 &&
        hasSessionFlag('navigating_by_impossibility') &&
        gameState.endingsSeen.length >= 4) ||
      (gameState.chapter >= 8 &&
        hasSessionFlag('achieved_bootstrap_navigation') &&
        gameState.endingsSeen.length >= 5),
    unlocks: 'mastered_fold_navigation'
  },

  ending_emergence_protocol: {
    tier: 'true',
    name: 'EMERGENCE PROTOCOL',
    content_file: 'endings/emergence_protocol.txt',
    condition: () =>
      gameState.chapter >= 5 &&
      gameState.endingsSeen.length >= 3 &&
      (hasSessionFlag('guided_by_fold') ||
        hasSessionFlag('understood_dual_truth') ||
        hasSessionFlag('navigating_by_knowledge') ||
        hasSessionFlag('achieved_recognition') ||
        hasSessionFlag('achieved_reflection_recognition') ||
        hasSessionFlag('cooperated_with_self') ||
        hasSessionFlag('achieved_presence_communion') ||
        hasSessionFlag('achieved_communion') ||
        hasSessionFlag('achieved_cooperation') ||
        hasSessionFlag('achieved_enlightened_navigation') ||
        hasSessionFlag('shared_navigation_data') ||
        hasSessionFlag('coordinated_all_iterations')),
    unlocks: 'achieved_emergence',
    has_post_choice: true
  }

};

// ============================================
// ENDING PRIORITY ORDER
// Checked in this order - first match wins
// ============================================

const ENDING_PRIORITY = [
  'ending_navigation_by_nightmare',
  'ending_emergence_protocol',

  'ending_refused',
  'ending_ejection',
  'ending_regression',
  'ending_fragmentation',
  'ending_dissolution',
  'ending_consumption',

  'ending_compromise',
  'ending_violent_emergence'
];
