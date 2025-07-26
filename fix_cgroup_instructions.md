# Judge0 Cgroup Fix Guide

## Problem
Judge0 API returns "No such file or directory @ rb_sysopen - /box/script.js" with status 13 (Internal Error) because it requires legacy cgroup support (cgroup v1) which is disabled by default on modern systems.

## Solution

### Step 1: Enable Legacy Cgroup Support

#### For GRUB-based systems (Ubuntu, Debian, CentOS, etc.):

1. Edit the GRUB configuration:
```bash
sudo nano /etc/default/grub
```

2. Find the line starting with `GRUB_CMDLINE_LINUX_DEFAULT` and add the cgroup parameters:
```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash systemd.unified_cgroup_hierarchy=0 systemd.legacy_systemd_cgroup_controller=1"
```

Or if the line contains other parameters, append them:
```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash systemd.unified_cgroup_hierarchy=0 systemd.legacy_systemd_cgroup_controller=1"
```

3. Update GRUB:
```bash
sudo update-grub
```

#### For systemd-boot systems:

1. Edit the boot entry:
```bash
sudo nano /boot/loader/entries/your-entry.conf
```

2. Add to the `options` line:
```bash
options root=UUID=your-uuid systemd.unified_cgroup_hierarchy=0 systemd.legacy_systemd_cgroup_controller=1
```

### Step 2: Alternative Environment Variable Method

If you prefer not to modify kernel parameters, you can try setting environment variables:

```bash
export SYSTEMD_CGROUP_ENABLE_LEGACY_FORCE=1
export SYSTEMD_UNIFIED_CGROUP_HIERARCHY=0
```

Add these to your shell profile or Docker environment.

### Step 3: Reboot System

After making the changes:
```bash
sudo reboot
```

### Step 4: Verify Cgroup Configuration

After reboot, verify that legacy cgroups are enabled:

```bash
# Check if cgroup v1 is mounted
ls -la /sys/fs/cgroup/

# Should show directories like: cpuset, cpu, memory, etc.
# If you only see unified, cgroup v2 is still active

# Check kernel command line
cat /proc/cmdline
# Should contain: systemd.unified_cgroup_hierarchy=0
```

### Step 5: Test Judge0

Now test your Judge0 API with a simple submission:

```bash
curl -X POST \
  http://localhost:2358/submissions \
  -H 'Content-Type: application/json' \
  -d '{
    "source_code": "console.log(\"Hello World\");",
    "language_id": 63,
    "stdin": ""
  }'
```

## Docker-Specific Considerations

If running Judge0 in Docker, ensure:

1. **Privileged mode is enabled** (already configured in your docker-compose.yml):
```yaml
privileged: true
```

2. **Host cgroup configuration is properly applied** - the container inherits the host's cgroup configuration

3. **Consider using Docker's cgroup v1 support**:
```bash
# Add to docker daemon.json
{
  "exec-opts": ["native.cgroupdriver=cgroupfs"]
}
```

## Troubleshooting

### If the issue persists:

1. **Check isolate installation**:
```bash
# Inside the Judge0 container
isolate --version
```

2. **Test isolate directly**:
```bash
# Inside the Judge0 container
isolate -b 0 --init
# Should create a sandbox without errors
```

3. **Check system logs**:
```bash
sudo journalctl -u docker
sudo dmesg | grep cgroup
```

### Alternative: Use Judge0 with cgroup v2 support

Consider upgrading to a newer version of Judge0 that supports cgroup v2, or using the community-maintained versions that have been updated for modern systems.

## Environment Variables for Docker

If you prefer to use environment variables in your Docker setup:

```yaml
# In docker-compose.yml
environment:
  - SYSTEMD_CGROUP_ENABLE_LEGACY_FORCE=1
  - SYSTEMD_UNIFIED_CGROUP_HIERARCHY=0
```

## Notes

- This configuration change affects the entire system's cgroup behavior
- Legacy cgroups (v1) are considered deprecated but still supported
- Some container orchestration platforms may require additional configuration
- Consider the security implications of running containers in privileged mode 