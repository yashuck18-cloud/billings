class AppConstants {
  static const List<String> units = [
    'Kg',
    'Gram',
    'Liter',
    'Piece',
    'Box',
    'Packet',
    'Bottle',
    'Dozen',
  ];

  // Standard pack presets mapped to equivalent quantity multiplier (e.g., "500 g" is 0.5 of "Kg")
  static const Map<String, Map<String, double>> fixedPacks = {
    'Kg': {
      '250 g Pack': 0.25,
      '500 g Pack': 0.5,
      '1 Kg Pack': 1.0,
      '2 Kg Pack': 2.0,
      '5 Kg Pack': 5.0,
    },
    'Gram': {
      '50 g Pack': 50.0,
      '100 g Pack': 100.0,
      '250 g Pack': 250.0,
      '500 g Pack': 500.0,
    },
    'Liter': {
      '100 ml Pack': 0.1,
      '250 ml Pack': 0.25,
      '500 ml Pack': 0.5,
      '1 L Pack': 1.0,
      '2 L Pack': 2.0,
    },
    'Piece': {
      'Single Pack': 1.0,
      '5 pcs Pack': 5.0,
      '10 pcs Box': 10.0,
      '12 pcs Pack': 12.0,
    },
    'Box': {
      'Standard Box': 1.0,
      'Carton (6 Boxes)': 6.0,
      'Carton (12 Boxes)': 12.0,
    },
    'Packet': {
      'Single Pkt': 1.0,
      '10 Pkt Bundle': 10.0,
    },
    'Bottle': {
      'Single Bottle': 1.0,
      '6-Bottle Case': 6.0,
      '12-Bottle Case': 12.0,
    },
  };
}
