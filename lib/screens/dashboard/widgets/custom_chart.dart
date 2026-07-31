import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class CustomTrendChart extends StatelessWidget {
  final List<double> data;
  final List<String> labels;
  final String title;
  final String valPrefix;
  final Color chartColor;

  const CustomTrendChart({
    super.key,
    required this.data,
    required this.labels,
    required this.title,
    this.valPrefix = '₹',
    this.chartColor = Colors.indigo,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              width: double.infinity,
              child: CustomPaint(
                painter: _ChartPainter(
                  data: data,
                  labels: labels,
                  prefix: valPrefix,
                  lineColor: chartColor,
                  gridColor: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                  textColor: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  final List<double> data;
  final List<String> labels;
  final String prefix;
  final Color lineColor;
  final Color gridColor;
  final Color textColor;

  _ChartPainter({
    required this.data,
    required this.labels,
    required this.prefix,
    required this.lineColor,
    required this.gridColor,
    required this.textColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;

    final double maxVal = data.reduce((a, b) => a > b ? a : b);
    
    // Adjust y-axis bounds for padding, avoiding division by zero if maxVal is 0
    final double upperLimit = maxVal == 0 ? 10.0 : maxVal * 1.15;
    
    const double paddingLeft = 40.0;
    const double paddingRight = 10.0;
    const double paddingTop = 10.0;
    const double paddingBottom = 20.0;

    final double chartWidth = size.width - paddingLeft - paddingRight;
    final double chartHeight = size.height - paddingTop - paddingBottom;

    // Draw Grid Lines (Horizontal)
    final gridPaint = Paint()
      ..color = gridColor
      ..strokeWidth = 1.0;

    final textPainter = TextPainter(
      textDirection: TextDirection.ltr,
    );

    // Draw 4 grid lines
    for (int i = 0; i <= 3; i++) {
      final double y = paddingTop + (chartHeight / 3) * i;
      canvas.drawLine(
        Offset(paddingLeft, y),
        Offset(size.width - paddingRight, y),
        gridPaint,
      );

      // Draw grid values
      final double val = upperLimit - (upperLimit / 3) * i;
      textPainter.text = TextSpan(
        text: '$prefix${val.toStringAsFixed(0)}',
        style: TextStyle(color: textColor, fontSize: 10),
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(paddingLeft - textPainter.width - 6, y - textPainter.height / 2),
      );
    }

    // Map data to coordinates
    final List<Offset> points = [];
    final double dx = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
    for (int i = 0; i < data.length; i++) {
      final double x = paddingLeft + dx * i;
      final double y = paddingTop + chartHeight - (data[i] / upperLimit) * chartHeight;
      points.add(Offset(x, y));
    }

    // Draw Gradient Area under the line
    if (points.length > 1) {
      final fillPath = Path();
      fillPath.moveTo(points.first.dx, paddingTop + chartHeight);
      for (int i = 0; i < points.length; i++) {
        if (i == 0) {
          fillPath.lineTo(points[i].dx, points[i].dy);
        } else {
          // Draw smooth bezier curve
          final prevPoint = points[i - 1];
          final currentPoint = points[i];
          final controlPoint1 = Offset(prevPoint.dx + (currentPoint.dx - prevPoint.dx) / 2, prevPoint.dy);
          final controlPoint2 = Offset(prevPoint.dx + (currentPoint.dx - prevPoint.dx) / 2, currentPoint.dy);
          fillPath.cubicTo(controlPoint1.dx, controlPoint1.dy, controlPoint2.dx, controlPoint2.dy, currentPoint.dx, currentPoint.dy);
        }
      }
      fillPath.lineTo(points.last.dx, paddingTop + chartHeight);
      fillPath.close();

      final areaGradient = ui.Gradient.linear(
        Offset(paddingLeft, paddingTop),
        Offset(paddingLeft, paddingTop + chartHeight),
        [
          lineColor.withOpacity(0.4),
          lineColor.withOpacity(0.0),
        ],
      );

      final fillPaint = Paint()
        ..shader = areaGradient
        ..style = PaintingStyle.fill;

      canvas.drawPath(fillPath, fillPaint);
    }

    // Draw Smooth Line
    final linePaint = Paint()
      ..color = lineColor
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final linePath = Path();
    for (int i = 0; i < points.length; i++) {
      if (i == 0) {
        linePath.moveTo(points[i].dx, points[i].dy);
      } else {
        final prevPoint = points[i - 1];
        final currentPoint = points[i];
        final controlPoint1 = Offset(prevPoint.dx + (currentPoint.dx - prevPoint.dx) / 2, prevPoint.dy);
        final controlPoint2 = Offset(prevPoint.dx + (currentPoint.dx - prevPoint.dx) / 2, currentPoint.dy);
        linePath.cubicTo(controlPoint1.dx, controlPoint1.dy, controlPoint2.dx, controlPoint2.dy, currentPoint.dx, currentPoint.dy);
      }
    }
    canvas.drawPath(linePath, linePaint);

    // Draw Data Point Dots & Labels
    final dotPaint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.fill;

    final dotBorderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    for (int i = 0; i < points.length; i++) {
      // Draw Dot
      canvas.drawCircle(points[i], 4.0, dotPaint);
      canvas.drawCircle(points[i], 4.0, dotBorderPaint);

      // Draw X Label
      if (i < labels.length) {
        textPainter.text = TextSpan(
          text: labels[i],
          style: TextStyle(color: textColor, fontSize: 10, fontWeight: FontWeight.w500),
        );
        textPainter.layout();
        textPainter.paint(
          canvas,
          Offset(points[i].dx - textPainter.width / 2, paddingTop + chartHeight + 6),
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
