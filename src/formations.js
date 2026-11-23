// Matematiksel Koreografi ve Düşman Formasyon Motoru
// Bezier eğrileri, V-formasyonu, makas geçişleri, loop-the-loop çemberleri ve taktiksel duruşlar
window.Formations = {
  // Kübik Bezier Nokta Hesabı
  cubicBezier(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
    };
  },

  // Düşmanın hareket yörüngesini günceller (her frame çağrılır)
  updateEnemyPath(e, dt, player) {
    e.age += dt;
    const prevX = e.x;
    const prevY = e.y;

    switch (e.pattern) {
      case 'v_formation': {
        // V-Formasyonu: Yukarıdan hizalı girer, orta alanda hafif sağ-sol salınım yapar ve iner
        e.y += e.speed * dt;
        e.x = e.anchorX + Math.sin(e.age * 2.2 + e.phase) * 36;
        break;
      }

      case 'sine_wave': {
        // Organik/Mekanik Hibrit (Kalamar Meka) senkronize sinüs dalgası
        e.y += e.speed * dt;
        e.x = e.anchorX + Math.sin(e.age * e.freq + e.phase) * e.amp;
        break;
      }

      case 'scissor_cross': {
        // Çapraz Makas Geçişi: Sağ ve soldan kavisle çapraz keserek geçer
        const t = Math.min(1.2, e.age / e.duration);
        const pos = this.cubicBezier(
          t,
          e.p0,
          e.p1,
          e.p2,
          e.p3
        );
        e.x = pos.x;
        e.y = pos.y;
        if (t >= 1.15) e.y = 1100; // Ekrandan çıkış
        break;
      }

      case 'tactical_hover': {
        // Kavis çizerek girip ortada havalı pozisyon alma, ateş açma ve ardından kaçış manevrası
        if (e.age < 1.35) {
          // 1) Kavisli giriş
          const t = e.age / 1.35;
          const ease = 1 - Math.pow(1 - t, 3);
          e.x = e.startX + (e.targetX - e.startX) * ease;
          e.y = e.startY + (e.targetY - e.startY) * ease;
        } else if (e.age < 1.35 + e.hoverDuration) {
          // 2) Havalı taktiksel duruş ve hafif süzülme
          const hAge = e.age - 1.35;
          e.x = e.targetX + Math.sin(hAge * 3.0 + e.phase) * 18;
          e.y = e.targetY + Math.cos(hAge * 2.2) * 8;
        } else {
          // 3) Hızlı kavisli kaçış dalışı
          const exitAge = e.age - (1.35 + e.hoverDuration);
          e.y += (e.speed * 1.45 + exitAge * 220) * dt;
          e.x += e.exitDir * 115 * dt;
        }
        break;
      }

      case 'loop_the_loop': {
        // Grup halinde 360 derece tam çember (Loop-the-Loop) çizip dalışa geçme
        const enterTime = 1.1;
        const loopTime = 1.9;
        if (e.age < enterTime) {
          const t = e.age / enterTime;
          e.x = e.startX + (e.loopCenterX - e.startX) * t;
          e.y = e.startY + (e.loopCenterY - e.startY) * t;
        } else if (e.age < enterTime + loopTime) {
          const lt = (e.age - enterTime) / loopTime;
          const angle = -Math.PI * 0.5 + lt * Math.PI * 2 * e.loopDir;
          e.x = e.loopCenterX + Math.cos(angle) * e.loopRadius;
          e.y = e.loopCenterY + Math.sin(angle) * e.loopRadius;
        } else {
          e.y += e.speed * 1.35 * dt;
          e.x += Math.sin(e.age * 4) * 90 * dt;
        }
        break;
      }

      case 'kamikaze_dive': {
        // İntihar Dalışı: Kısa süre hedef kilitler, burnunu oyuncuya çevirip roket gibi atılır
        if (e.age < 0.85) {
          e.y += 120 * dt;
          if (player) {
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            e.lockedAngle = Math.atan2(dy, dx);
          }
        } else {
          const diveSpeed = e.speed * 2.35;
          e.x += Math.cos(e.lockedAngle) * diveSpeed * dt;
          e.y += Math.sin(e.lockedAngle) * diveSpeed * dt;
        }
        break;
      }

      default: {
        e.y += e.speed * dt;
        break;
      }
    }

    // Hareket yönüne göre hafif yatış / dönüş açısı hesapla
    const vx = (e.x - prevX) / Math.max(0.001, dt);
    const vy = (e.y - prevY) / Math.max(0.001, dt);
    if (e.pattern === 'loop_the_loop' && e.age >= 1.1 && e.age < 3.0) {
      e.rotation = Math.atan2(vy, vx) - Math.PI * 0.5;
    } else if (e.pattern === 'kamikaze_dive' && e.age >= 0.3) {
      e.rotation = e.lockedAngle - Math.PI * 0.5;
    } else {
      e.rotation = Math.max(-0.35, Math.min(0.35, -vx * 0.0012));
    }
  }
};
