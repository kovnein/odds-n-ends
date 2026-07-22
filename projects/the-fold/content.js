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
        next: 'instinct_path' // not yet ported - engine will show fallback
      },
      {
        text: "Investigate the discrepancy (find out what's wrong)",
        flag: 'investigated_anomaly',
        permanent_flag: 'investigated_before',
        next: 'first_hour_investigate' // not yet ported - engine will show fallback
      }
    ],
    conditional_options: []
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
        next: 'instrument_glance' // not yet ported - engine will show fallback
      }
    ],
    conditional_options: []
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
        next: 'forced_confrontation_face' // not yet ported - engine will show fallback
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
        next: 'scene_understanding' // not yet ported - engine will show fallback
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
    conditional_options: []
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
        next: 'scene_understanding' // not yet ported - engine will show fallback
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
        next: 'scene_understanding' // not yet ported - engine will show fallback
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
        next: 'scene_understanding' // not yet ported - engine will show fallback
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
